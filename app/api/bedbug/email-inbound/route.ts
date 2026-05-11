import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Postmark inbound webhook handler. When Karl replies to one of our
// outgoing emails (cost summary, sms-outbound gap-mode email, or a future
// per-issue thread), Postmark POSTs the parsed message here. The handler:
//
//   1. Verifies Basic Auth (POSTMARK_INBOUND_USER / POSTMARK_INBOUND_PASS,
//      configured in the Postmark inbound stream URL).
//   2. Whitelists From against KARL_EMAIL.
//   3. Pulls the issue number out of the To address (bedbug+<N>@inbound...
//      sub-addressing) OR out of the subject ("[mom-bedbug #N]" pattern).
//   4. Posts the reply text as an issue comment via GITHUB_TOKEN_INTAKE.
//      That fires answer-mom.yml → SMS/email to Mom.
//
// Postmark inbound docs:
//   https://postmarkapp.com/developer/user-guide/inbound

type PostmarkInbound = {
  From?: string;
  FromFull?: { Email?: string };
  To?: string;
  ToFull?: Array<{ Email?: string }>;
  Subject?: string;
  TextBody?: string;
  StrippedTextReply?: string;
  MessageID?: string;
};

function checkBasicAuth(req: NextRequest): boolean {
  const user = process.env.POSTMARK_INBOUND_USER;
  const pass = process.env.POSTMARK_INBOUND_PASS;
  if (!user || !pass) return false;
  const expected =
    "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  const provided = req.headers.get("authorization") ?? "";
  if (provided.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(provided),
      Buffer.from(expected),
    );
  } catch {
    return false;
  }
}

function extractIssueNumber(payload: PostmarkInbound): number | null {
  // Try sub-addressing first: bedbug+<N>@anything
  const candidates: string[] = [];
  if (payload.To) candidates.push(payload.To);
  if (Array.isArray(payload.ToFull)) {
    for (const t of payload.ToFull) {
      if (t?.Email) candidates.push(t.Email);
    }
  }
  for (const addr of candidates) {
    const m = addr.match(/bedbug\+(\d+)@/i);
    if (m) {
      const n = Number.parseInt(m[1], 10);
      if (n > 0) return n;
    }
  }
  // Fallback: subject contains "[mom-bedbug #N]" or "(#N)"
  const subj = payload.Subject ?? "";
  const subjMatch = subj.match(/#(\d+)/);
  if (subjMatch) {
    const n = Number.parseInt(subjMatch[1], 10);
    if (n > 0) return n;
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!checkBasicAuth(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let payload: PostmarkInbound;
  try {
    payload = (await req.json()) as PostmarkInbound;
  } catch {
    return new NextResponse("Body must be JSON", { status: 400 });
  }

  const karlEmail = (process.env.KARL_EMAIL ?? "").toLowerCase();
  if (!karlEmail) {
    return new NextResponse("KARL_EMAIL not configured", { status: 500 });
  }
  const senderEmail = (
    payload.FromFull?.Email ?? payload.From ?? ""
  )
    .toLowerCase()
    .replace(/^.*<([^>]+)>.*$/, "$1")
    .trim();
  if (senderEmail !== karlEmail) {
    console.warn(`email-inbound: dropping mail from non-whitelisted ${senderEmail}`);
    return new NextResponse("", { status: 200 });
  }

  const issueNumber = extractIssueNumber(payload);
  if (!issueNumber) {
    console.warn(
      `email-inbound: no issue number found in To=${payload.To} Subject=${payload.Subject}`,
    );
    return new NextResponse("", { status: 200 });
  }

  // Prefer the stripped reply (just Karl's new text, not the quoted thread).
  const replyRaw = payload.StrippedTextReply ?? payload.TextBody ?? "";
  const reply = replyRaw.trim();
  if (!reply) {
    return new NextResponse("", { status: 200 });
  }

  const ghToken = process.env.GITHUB_TOKEN_INTAKE;
  const repo = process.env.GITHUB_REPO ?? "karlmarx/mom-93fyi";
  if (!ghToken) {
    return new NextResponse("GitHub token not configured", { status: 500 });
  }

  const ghRes = await fetch(
    `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "mom-bedbug-email-inbound",
      },
      body: JSON.stringify({ body: reply }),
    },
  );
  if (!ghRes.ok) {
    const errText = await ghRes.text();
    console.error(`email-inbound: GitHub comment failed ${ghRes.status}: ${errText}`);
    return new NextResponse(`GitHub comment failed: ${ghRes.status}`, { status: 502 });
  }

  return NextResponse.json({ ok: true, issue: issueNumber });
}
