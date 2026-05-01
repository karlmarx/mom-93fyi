import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Strip basic markdown that doesn't render in plain SMS.
function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/(?<![*_])\*(?!\*)([^*\n]+?)\*(?!\*)/g, "$1") // italic *
    .replace(/(?<![*_])_(?!_)([^_\n]+?)_(?!_)/g, "$1") // italic _
    .replace(/`([^`\n]+)`/g, "$1") // inline code
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^>\s?/gm, "") // blockquotes
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/^\s*[-*+]\s+/gm, "• ") // list bullets
    .trim();
}

// SMS practical max — Twilio splits into segments at 160 chars (GSM-7) or
// 70 chars (UCS-2 / Unicode). Cap at 1500 to keep cost bounded but allow
// reasonable answers.
const SMS_MAX = 1500;

type IntakeBody = {
  body?: unknown;
  issue?: unknown; // optional — issue number for backlinking
  originator?: unknown; // "mom" | "karl" — defaults to "mom"
};

async function sendSms(
  body: string,
  toPhone: string,
): Promise<{ ok: boolean; status: number; detail?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    return { ok: false, status: 500, detail: "Twilio env not configured" };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const form = new URLSearchParams();
  form.set("From", from);
  form.set("To", toPhone);
  form.set("Body", body);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    },
  );

  if (!res.ok) {
    return { ok: false, status: res.status, detail: await res.text() };
  }
  return { ok: true, status: 200 };
}

async function sendEmail(
  body: string,
  toEmail: string,
  subject: string,
): Promise<{ ok: boolean; status: number; detail?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "ben@bedbug.93.fyi";
  if (!key) {
    return { ok: false, status: 500, detail: "RESEND_API_KEY not configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Bedbug Q&A <${from}>`,
      to: [toEmail],
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    return { ok: false, status: res.status, detail: await res.text() };
  }
  return { ok: true, status: 200 };
}

export async function POST(req: NextRequest) {
  // Shared-secret auth — only callers who know the secret can send.
  // Constant-time compared to avoid timing leaks.
  const expected = process.env.INTAKE_SECRET;
  if (!expected) {
    return new NextResponse("Server not configured", { status: 500 });
  }
  const provided =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    req.headers.get("x-intake-secret") ??
    "";
  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(
      Buffer.from(provided.padEnd(expected.length, "\0")),
      Buffer.from(expected),
    )
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const momPhone = process.env.MOM_PHONE;
  const momEmail = process.env.MOM_EMAIL;
  const karlEmail = process.env.KARL_EMAIL;
  const smsLive = process.env.SMS_LIVE === "true";

  if (!momPhone) {
    return new NextResponse("MOM_PHONE not set", { status: 500 });
  }

  let payload: IntakeBody;
  try {
    payload = (await req.json()) as IntakeBody;
  } catch {
    return new NextResponse("Body must be JSON", { status: 400 });
  }

  const raw = typeof payload.body === "string" ? payload.body : "";
  if (!raw.trim()) {
    return new NextResponse("Empty body", { status: 400 });
  }

  // The label-derived originator decides where the answer lands. Defaults
  // to "mom" so the workflow's old contract still works if originator is
  // omitted. The recipient is *never* taken from the request payload.
  const originator =
    payload.originator === "karl" ? "karl" : "mom";

  const text = stripMarkdown(raw);
  const truncated =
    text.length > SMS_MAX ? `${text.slice(0, SMS_MAX - 3)}...` : text;

  // Karl always gets email — he's only ever a sender for testing/admin,
  // never a real SMS recipient.
  if (originator === "karl") {
    if (!karlEmail) {
      return new NextResponse("KARL_EMAIL not set", { status: 500 });
    }
    const result = await sendEmail(
      truncated,
      karlEmail,
      "Bedbug Q&A — your reply",
    );
    if (!result.ok) {
      console.error(
        `sms-outbound: Karl email failed ${result.status}: ${result.detail}`,
      );
      return new NextResponse("Send failed", { status: 502 });
    }
    return NextResponse.json({ channel: "email", to: "karl" });
  }

  if (smsLive) {
    const result = await sendSms(truncated, momPhone);
    if (!result.ok) {
      console.error(
        `sms-outbound: Twilio send failed ${result.status}: ${result.detail}`,
      );
      return new NextResponse("Send failed", { status: 502 });
    }
    return NextResponse.json({ channel: "sms", to: "mom" });
  }

  // Gap mode — A2P 10DLC isn't approved yet. Email Mom directly.
  if (!momEmail) {
    return new NextResponse(
      "SMS_LIVE=false but MOM_EMAIL not set — cannot deliver",
      { status: 500 },
    );
  }
  const result = await sendEmail(truncated, momEmail, "From Ben");
  if (!result.ok) {
    console.error(
      `sms-outbound: email send failed ${result.status}: ${result.detail}`,
    );
    return new NextResponse("Send failed", { status: 502 });
  }
  return NextResponse.json({ channel: "email", to: "mom" });
}
