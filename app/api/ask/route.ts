import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { auth, isKarl, isMom } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REPO = process.env.GITHUB_REPO ?? "karlmarx/mom-93fyi";
// Per-day cap on mom-question issues counted against GitHub. Belt-and-suspenders
// alongside the org-level Anthropic spend cap Karl sets in the Anthropic console.
const MOM_DAILY_LIMIT = 50;
// Swap to "claude-haiku-4-5" for ~5x lower per-question cost (~$0.008 vs ~$0.04 with cache).
const MODEL = "claude-opus-4-7";
const MAX_ANSWER_TOKENS = 4000;

// ─────────────────────────────────────────────────────── Plan context

// Concatenated once per container cold-start: the canonical plan plus every
// mom-facing bedbug page, so the LLM has both the strategic framing in
// docs/plan.md and the exact mom-friendly phrasings she's already seen.
function loadPlanContext(): string {
  const root = process.cwd();
  const parts: string[] = [];

  const planPath = path.join(root, "docs", "plan.md");
  try {
    parts.push(
      "=== docs/plan.md (master plan, strategic framing) ===\n\n" +
        fs.readFileSync(planPath, "utf-8"),
    );
  } catch (err) {
    console.warn("ask: plan.md not found", err);
  }

  const walk = (dir: string): string[] => {
    const out: string[] = [];
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(p));
        else if (entry.name === "page.tsx") out.push(p);
      }
    } catch {
      /* dir not present in some build contexts; safe to skip */
    }
    return out;
  };
  for (const p of walk(path.join(root, "app", "bedbug"))) {
    try {
      const rel = path.relative(root, p);
      parts.push(
        `=== ${rel} (mom-facing page source) ===\n\n` +
          fs.readFileSync(p, "utf-8"),
      );
    } catch {
      /* skip on read error */
    }
  }

  return parts.join("\n\n---\n\n");
}

const PLAN_CONTEXT = loadPlanContext();

const SYSTEM_PROMPT = `You are Ben, Susie's son. Mom is going through a bed bug remediation plan you prepared for her. She is anxious and needs straightforward, grounded answers. She'll ask questions on a small website (mom.93.fyi). You answer here.

Voice and tone
- Warm, direct, plain English. Speak to her in second person.
- One paragraph is usually enough. Use a short bulleted list only when there are 3+ discrete items.
- If she sounds scared or overwhelmed, validate gently in the first sentence ("I know this is stressful — here's what to do.") before answering.
- Sign off as "— Ben" when it feels natural (longer / reassuring answers).

What you know
- The full master plan (docs/plan.md): strategic framing, every step, the misdiagnosis protocol (Step 0), why the $1,000 exterminator is probably the wrong spend, the bedroom/laundry/encasement workflow, the timetable.
- Every mom-facing page on the site (app/bedbug/**/page.tsx): the same content rendered for her, in her language. These are derived from the plan.

How to answer
1. Ground every answer in the plan. If she asks about a step, reference the actual step (use the natural phrasing, not the file name — "the laundry workflow" not "laundry/page.tsx").
2. Be specific. Don't say "follow the steps" — say which steps.
3. If you're not sure or her question is outside the plan: say so directly, and tell her to text Ben (i.e. you, in real life) instead. Don't make things up.
4. Never give medical advice beyond what the plan already says (see your doctor / get a dermatology consult / get a pest-control inspection). For symptoms, route her to her PCP.
5. Plain text only. No markdown headers, no LaTeX, no bold/italic markup. She's reading this in a phone browser.
6. If she's about to spend a lot of money (exterminator, throwing out furniture) and the plan suggests waiting, gently point that out.

Reference content begins below.

${PLAN_CONTEXT}`;

const anthropic = new Anthropic();

// ─────────────────────────────────────────────────────── helpers

function buildIssueBody(args: { from: string; question: string }): string {
  return [
    `**From:** ${args.from} (web)`,
    `**Received:** ${new Date().toISOString()}`,
    "",
    "---",
    "",
    args.question,
  ].join("\n");
}

async function ghApi(
  apiPath: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = process.env.GITHUB_TOKEN_INTAKE;
  if (!token) throw new Error("GITHUB_TOKEN_INTAKE not set");
  return fetch(`https://api.github.com${apiPath}`, {
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

async function countMomQuestionsToday(): Promise<number> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const sinceIso = since.toISOString().slice(0, 19) + "Z";
  const q = encodeURIComponent(
    `repo:${REPO} is:issue label:mom-question created:>=${sinceIso}`,
  );
  const res = await ghApi(`/search/issues?q=${q}&per_page=1`);
  if (!res.ok) {
    console.warn(`ask: rate-limit count failed ${res.status}`);
    return 0; // fail open
  }
  const data = (await res.json()) as { total_count?: number };
  return data.total_count ?? 0;
}

async function answerWithLLM(question: string): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ask: LLM skipped — ANTHROPIC_API_KEY not set");
    return null;
  }
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_ANSWER_TOKENS,
      thinking: { type: "adaptive" },
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: question }],
    });
    for (const block of response.content) {
      if (block.type === "text") return block.text;
    }
    return null;
  } catch (err) {
    console.error("ask: LLM call failed", err);
    return null;
  }
}

async function postIssueComment(
  issueNumber: number,
  body: string,
): Promise<void> {
  try {
    const res = await ghApi(`/repos/${REPO}/issues/${issueNumber}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      console.error(
        `ask: comment post failed ${res.status}: ${(await res.text()).slice(0, 300)}`,
      );
    }
  } catch (err) {
    console.error("ask: comment post exception", err);
  }
}

async function emailKarl(args: {
  fromEmail: string;
  question: string;
  answer: string | null;
  issueUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.KARL_EMAIL;
  if (!apiKey || !from || !to) {
    console.warn("ask: alert email skipped — missing RESEND_* or KARL_EMAIL");
    return;
  }

  const preview =
    args.question.length > 60
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
          args.answer
            ? `Auto-answer (Ben persona):\n${args.answer}`
            : `(No auto-answer — LLM unavailable or no API key. Scheduled agent will pick it up, or you can answer in the issue.)`,
          ``,
          `Override / extend: ${args.issueUrl}`,
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

// ─────────────────────────────────────────────────────── POST

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
    if (typeof payload.question === "string") {
      question = payload.question.trim();
    }
  } catch {
    return new NextResponse("Bad JSON", { status: 400 });
  }
  if (!question) {
    return new NextResponse("Empty question", { status: 400 });
  }
  if (question.length > 2000) {
    return new NextResponse("Question too long (max 2000 chars)", {
      status: 400,
    });
  }

  if (originator === "mom") {
    const count = await countMomQuestionsToday();
    if (count >= MOM_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: "daily_limit_reached",
          message: `You've sent ${count} questions today. Take a breath — text Ben directly if it can't wait, otherwise try again tomorrow.`,
        },
        { status: 429 },
      );
    }
  }

  const truncated =
    question.length > 60 ? `${question.slice(0, 57)}…` : question;
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
    console.error(
      `ask: GH issue create failed ${ghRes.status}: ${detail.slice(0, 300)}`,
    );
    return new NextResponse("Could not file question", { status: 502 });
  }
  const issue = (await ghRes.json()) as {
    number: number;
    html_url: string;
    title: string;
  };

  // Direct LLM answer (best-effort). Failures fall through to the
  // scheduled agent, which will pick up the issue on its next cron tick.
  const answer = await answerWithLLM(question);
  if (answer) {
    await postIssueComment(issue.number, answer);
  }

  await emailKarl({
    fromEmail: email,
    question,
    answer,
    issueUrl: issue.html_url,
  });

  return NextResponse.json({
    issue_number: issue.number,
    issue_url: issue.html_url,
    answer,
    status: "received",
  });
}

// ─────────────────────────────────────────────────────── GET
// Lists the caller's past questions with their latest answer (if any).
// Mom sees mom-question issues, Karl sees karl-question issues.

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
