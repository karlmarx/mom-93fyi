import { NextResponse, type NextRequest } from "next/server";
import { auth, isKarl, isMom } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPO = process.env.GITHUB_REPO ?? "karlmarx/mom-93fyi";

// Same envelope sms-inbound uses, so the existing agent-bridge
// list-pending query (open issues with mom-question / karl-question
// label and zero comments) catches both SMS and web-originated questions.
function buildIssueBody(args: {
  from: string;
  question: string;
}): string {
  return [
    `**From:** ${args.from} (web)`,
    `**Received:** ${new Date().toISOString()}`,
    "",
    "---",
    "",
    args.question,
  ].join("\n");
}

async function ghApi(path: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.GITHUB_TOKEN_INTAKE;
  if (!token) throw new Error("GITHUB_TOKEN_INTAKE not set");
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "mom-bedbug-web-intake",
    },
  });
}

async function emailKarl(args: {
  fromEmail: string;
  question: string;
  issueUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.KARL_EMAIL;
  if (!apiKey || !from || !to) {
    console.warn("ask: alert email skipped — missing RESEND_* or KARL_EMAIL");
    return;
  }

  const preview = args.question.length > 60
    ? `${args.question.slice(0, 57)}…`
    : args.question;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[Mom asked] ${preview}`,
        text: [
          `From: ${args.fromEmail} (web)`,
          ``,
          `Question:`,
          args.question,
          ``,
          `Issue: ${args.issueUrl}`,
        ].join("\n"),
      }),
    });
    if (!res.ok) {
      console.error(`ask: resend failed ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("ask: resend exception", err);
  }
}

// ──────────────────────────────────────────────────────────── POST
export async function POST(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email || (!isMom(email) && !isKarl(email))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const originator: "mom" | "karl" = isMom(email) ? "mom" : "karl";

  let question = "";
  try {
    const payload = (await req.json()) as { question?: unknown };
    if (typeof payload.question === "string") question = payload.question.trim();
  } catch {
    return new NextResponse("Bad JSON", { status: 400 });
  }
  if (!question) {
    return new NextResponse("Empty question", { status: 400 });
  }
  if (question.length > 2000) {
    return new NextResponse("Question too long (max 2000 chars)", { status: 400 });
  }

  const truncated = question.length > 60 ? `${question.slice(0, 57)}…` : question;
  const titlePrefix = originator === "mom" ? "Mom asked" : "Karl asked";
  const label = originator === "mom" ? "mom-question" : "karl-question";

  const ghRes = await ghApi(`/repos/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title: `${titlePrefix}: ${truncated}`,
      body: buildIssueBody({ from: email, question }),
      labels: [label, "web"],
    }),
  });
  if (!ghRes.ok) {
    const detail = await ghRes.text();
    console.error(`ask: GH issue create failed ${ghRes.status}: ${detail.slice(0, 300)}`);
    return new NextResponse("Could not file question", { status: 502 });
  }

  const issue = (await ghRes.json()) as {
    number: number;
    html_url: string;
    title: string;
  };

  await emailKarl({
    fromEmail: email,
    question,
    issueUrl: issue.html_url,
  });

  return NextResponse.json({
    issue_number: issue.number,
    issue_url: issue.html_url,
    status: "received",
  });
}

// ──────────────────────────────────────────────────────────── GET
// Lists the caller's past questions with their latest answer (if any).
// Mom sees mom-question issues, Karl sees karl-question issues. (Karl
// could see mom's too, but for symmetry the chat UI is per-user.)
export async function GET(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email || (!isMom(email) && !isKarl(email))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const role = new URL(req.url).searchParams.get("role");
  const label =
    role === "karl" || (role == null && isKarl(email))
      ? "karl-question"
      : "mom-question";

  // List recent issues with the relevant label.
  const listRes = await ghApi(
    `/repos/${REPO}/issues?state=all&labels=${label}&per_page=30&sort=created&direction=desc`,
  );
  if (!listRes.ok) {
    return new NextResponse("Could not load history", { status: 502 });
  }
  const issues = (await listRes.json()) as Array<{
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    comments: number;
    created_at: string;
    state: string;
  }>;

  // Pull latest comment for each issue that has comments (the answer).
  const enriched = await Promise.all(
    issues.map(async (i) => {
      let answer: string | null = null;
      let answer_at: string | null = null;
      if (i.comments > 0) {
        const cRes = await ghApi(
          `/repos/${REPO}/issues/${i.number}/comments?per_page=100`,
        );
        if (cRes.ok) {
          const comments = (await cRes.json()) as Array<{
            body: string;
            created_at: string;
          }>;
          const last = comments[comments.length - 1];
          if (last) {
            answer = last.body;
            answer_at = last.created_at;
          }
        }
      }
      const question = (() => {
        const body = i.body ?? "";
        const idx = body.indexOf("\n---\n");
        return idx === -1 ? body.trim() : body.slice(idx + 5).trim();
      })();
      return {
        issue_number: i.number,
        issue_url: i.html_url,
        question,
        answer,
        asked_at: i.created_at,
        answer_at,
        state: i.state,
      };
    }),
  );

  return NextResponse.json({ questions: enriched });
}
