import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bridge between the scheduled remote agent (running on Anthropic's cloud,
// no GitHub auth of its own) and GitHub. The agent talks here using
// INTAKE_SECRET; this endpoint uses GITHUB_TOKEN_INTAKE to actually act
// on the repo. Two paths:
//
//   GET  ?action=list-pending     — returns open mom-question / karl-question
//                                   issues with no comments and no
//                                   needs-human label
//   POST { action, issue, body? } — action ∈ {"answer", "escalate"}.
//                                   "answer" posts a comment (which fires
//                                   answer-mom.yml), "escalate" adds the
//                                   needs-human label only.
//
// The PAT identity is Karl's, so comments come from a real user (not a Bot)
// and the existing answer-mom.yml workflow fires on them.

const REPO = process.env.GITHUB_REPO ?? "karlmarx/mom-93fyi";

function checkAuth(req: NextRequest): boolean {
  const expected = process.env.INTAKE_SECRET;
  if (!expected) return false;
  const provided =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    req.headers.get("x-intake-secret") ??
    "";
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
      "User-Agent": "mom-bedbug-agent-bridge",
    },
  });
}

type PendingIssue = {
  issue_number: number;
  title: string;
  body: string;
  originator: "mom" | "karl";
  question: string;
};

function extractQuestion(body: string): string {
  const idx = body.indexOf("\n---\n");
  return idx === -1 ? body.trim() : body.slice(idx + 5).trim();
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const action = new URL(req.url).searchParams.get("action");
  if (action !== "list-pending") {
    return new NextResponse(`Unknown GET action: ${action}`, { status: 400 });
  }

  // GitHub search syntax can't OR labels, so query each label separately.
  const collected: PendingIssue[] = [];
  for (const label of ["mom-question", "karl-question"] as const) {
    const q = encodeURIComponent(
      `repo:${REPO} is:issue is:open comments:0 -label:needs-human label:${label}`,
    );
    const res = await ghApi(`/search/issues?q=${q}&per_page=50`);
    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `agent-bridge: search ${label} failed ${res.status}: ${errText.slice(0, 300)}`,
      );
      continue;
    }
    const data = (await res.json()) as { items?: Array<{ number: number; title: string; body: string | null }> };
    for (const item of data.items ?? []) {
      const body = item.body ?? "";
      collected.push({
        issue_number: item.number,
        title: item.title,
        body,
        originator: label === "mom-question" ? "mom" : "karl",
        question: extractQuestion(body),
      });
    }
  }

  return NextResponse.json({ issues: collected });
}

type PostBody = {
  action?: unknown;
  issue?: unknown;
  body?: unknown;
};

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let payload: PostBody;
  try {
    payload = (await req.json()) as PostBody;
  } catch {
    return new NextResponse("Body must be JSON", { status: 400 });
  }

  const action = typeof payload.action === "string" ? payload.action : "";
  const issueNumber = typeof payload.issue === "number" ? payload.issue : 0;
  if (!issueNumber || issueNumber <= 0) {
    return new NextResponse("Missing or invalid 'issue'", { status: 400 });
  }

  if (action === "answer") {
    const body = typeof payload.body === "string" ? payload.body.trim() : "";
    if (!body) {
      return new NextResponse("Missing 'body' for answer action", { status: 400 });
    }
    const res = await ghApi(`/repos/${REPO}/issues/${issueNumber}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `agent-bridge: comment failed ${res.status}: ${errText.slice(0, 300)}`,
      );
      return new NextResponse(`Comment failed: ${res.status}`, { status: 502 });
    }
    return NextResponse.json({ ok: true, action: "answered", issue: issueNumber });
  }

  if (action === "escalate") {
    const res = await ghApi(`/repos/${REPO}/issues/${issueNumber}/labels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labels: ["needs-human"] }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `agent-bridge: label failed ${res.status}: ${errText.slice(0, 300)}`,
      );
      return new NextResponse(`Label failed: ${res.status}`, { status: 502 });
    }
    return NextResponse.json({ ok: true, action: "escalated", issue: issueNumber });
  }

  return new NextResponse(`Unknown POST action: ${action}`, { status: 400 });
}
