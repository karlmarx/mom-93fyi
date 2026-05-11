#!/usr/bin/env node
// Auto-answer a mom-question / karl-question issue.
//
// Tier 1: Haiku 4.5 sees the bed-bug plan + relevant pages and replies with
//   ANSWER, ESCALATE, or NEEDS-HUMAN.
// Tier 2: On ESCALATE, Sonnet 4.6 retries with the same context.
// On NEEDS-HUMAN: label the issue and stop.
//
// Hard daily cost cap: before any API call, sums today's <!-- cost:{...} -->
// bot comments and aborts to needs-human if today's USD spend is at or above
// COST_CAP_DAILY_USD (default $0.25). After each call, posts a bot cost
// comment for the daily summary cron to read.

import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const issueArgIdx = args.indexOf("--issue");
const issueArg = issueArgIdx >= 0 ? args[issueArgIdx + 1] : null;

const requiredEnv = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env var: ${k}`);
  return v;
};

const ANTHROPIC_API_KEY = requiredEnv("ANTHROPIC_API_KEY");
const GH_TOKEN_ANSWER = requiredEnv("GH_TOKEN_ANSWER");
const GH_TOKEN_BOT = process.env.GH_TOKEN_BOT ?? GH_TOKEN_ANSWER;
const REPO = process.env.GITHUB_REPOSITORY ?? "karlmarx/mom-93fyi";

const COST_CAP_DAILY_USD = Number.parseFloat(
  process.env.COST_CAP_DAILY_USD ?? "0.25",
);

const MODEL_HAIKU = "claude-haiku-4-5-20251001";
const MODEL_SONNET = "claude-sonnet-4-6";

// Pricing per million tokens (USD). Update if Anthropic changes pricing.
const PRICING = {
  [MODEL_HAIKU]:  { input: 1.0, cache_read: 0.10, cache_write: 1.25, output: 5.0 },
  [MODEL_SONNET]: { input: 3.0, cache_read: 0.30, cache_write: 3.75, output: 15.0 },
};

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "mom-bedbug-auto-answer",
  };
}

async function fetchIssue(number) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${number}`,
    { headers: ghHeaders(GH_TOKEN_ANSWER) },
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch issue #${number}: ${res.status} ${await res.text()}`,
    );
  }
  return res.json();
}

async function postComment(token, number, body) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${number}/comments`,
    {
      method: "POST",
      headers: { ...ghHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    },
  );
  if (!res.ok) {
    throw new Error(`Comment failed: ${res.status} ${await res.text()}`);
  }
}

async function addLabel(number, label) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${number}/labels`,
    {
      method: "POST",
      headers: {
        ...ghHeaders(GH_TOKEN_BOT),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ labels: [label] }),
    },
  );
  if (!res.ok) {
    throw new Error(`Label failed: ${res.status} ${await res.text()}`);
  }
}

async function getTodaysSpend() {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const since = startOfDay.toISOString();
  let total = 0;
  let page = 1;
  while (page <= 10) {
    const url = `https://api.github.com/repos/${REPO}/issues/comments?since=${encodeURIComponent(since)}&per_page=100&page=${page}`;
    const res = await fetch(url, { headers: ghHeaders(GH_TOKEN_BOT) });
    if (!res.ok) {
      console.warn(
        `Could not read prior cost comments (${res.status}); continuing with 0`,
      );
      return 0;
    }
    const comments = await res.json();
    if (!Array.isArray(comments) || comments.length === 0) break;
    for (const c of comments) {
      const m = (c.body ?? "").match(/<!-- cost:(\{[^>]+\}) -->/);
      if (!m) continue;
      try {
        const parsed = JSON.parse(m[1]);
        if (typeof parsed.usd === "number") total += parsed.usd;
      } catch {
        // ignore malformed
      }
    }
    if (comments.length < 100) break;
    page += 1;
  }
  return total;
}

function priceCallUsd(model, usage) {
  const p = PRICING[model];
  if (!p) return 0;
  const cents =
    (usage.input_tokens ?? 0) * p.input +
    (usage.cache_creation_input_tokens ?? 0) * p.cache_write +
    (usage.cache_read_input_tokens ?? 0) * p.cache_read +
    (usage.output_tokens ?? 0) * p.output;
  return cents / 1_000_000;
}

async function callClaude(model, system, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = (data.content?.[0]?.text ?? "").trim();
  return { text, usage: data.usage ?? {} };
}

async function postCostComment(issueNumber, model, usage, usd, decision) {
  const payload = {
    model: model === MODEL_HAIKU ? "haiku-4-5" : "sonnet-4-6",
    ts: new Date().toISOString(),
    decision,
    tokens: {
      in: usage.input_tokens ?? 0,
      cache_read: usage.cache_read_input_tokens ?? 0,
      cache_write: usage.cache_creation_input_tokens ?? 0,
      out: usage.output_tokens ?? 0,
    },
    usd: Number(usd.toFixed(6)),
  };
  // Posted as github-actions[bot] (type=Bot) so answer-mom.yml ignores it.
  await postComment(GH_TOKEN_BOT, issueNumber, `<!-- cost:${JSON.stringify(payload)} -->`);
}

// ─── load the issue ───────────────────────────────────────────────────────

let issueNumber, issueBody, issueLabels;
if (issueArg) {
  issueNumber = Number.parseInt(issueArg, 10);
  const issue = await fetchIssue(issueNumber);
  issueBody = issue.body ?? "";
  issueLabels = (issue.labels ?? []).map((l) => l.name);
} else {
  issueNumber = Number.parseInt(requiredEnv("ISSUE_NUMBER"), 10);
  issueBody = requiredEnv("ISSUE_BODY");
  issueLabels = JSON.parse(requiredEnv("ISSUE_LABELS"));
}

if (
  !issueLabels.includes("mom-question") &&
  !issueLabels.includes("karl-question")
) {
  console.log("Issue is not a mom-question or karl-question; nothing to do.");
  process.exit(0);
}
if (issueLabels.includes("needs-human")) {
  console.log("Issue already labeled needs-human; nothing to do.");
  process.exit(0);
}

const isKarl = issueLabels.includes("karl-question");
const originator = isKarl ? "karl" : "mom";

function extractQuestion(body) {
  const idx = body.indexOf("\n---\n");
  return idx === -1 ? body.trim() : body.slice(idx + 5).trim();
}
const question = extractQuestion(issueBody);
console.log(
  `Issue #${issueNumber} (${originator}) — question: ${question.slice(0, 120)}${
    question.length > 120 ? "…" : ""
  }`,
);

// ─── cost cap check ───────────────────────────────────────────────────────

const spendSoFar = await getTodaysSpend();
console.log(
  `Today's spend so far: $${spendSoFar.toFixed(4)} / cap $${COST_CAP_DAILY_USD.toFixed(2)}`,
);
if (spendSoFar >= COST_CAP_DAILY_USD) {
  console.log("Daily cost cap reached. Escalating to human.");
  await postComment(
    GH_TOKEN_BOT,
    issueNumber,
    [
      "**🚨 Daily cost cap reached**",
      "",
      `Today's auto-answer spend is $${spendSoFar.toFixed(4)} (cap $${COST_CAP_DAILY_USD.toFixed(2)}).`,
      "Skipping the model and labeling for human review.",
      "@karlmarx — please reply manually.",
    ].join("\n"),
  );
  await addLabel(issueNumber, "needs-human");
  process.exit(0);
}

// ─── load reference context ───────────────────────────────────────────────

const PAGES = [
  ["docs/plan.md", "plan.md (source of truth)"],
  ["app/bedbug/items/page.tsx", "/bedbug/items"],
  ["app/bedbug/questions/page.tsx", "/bedbug/questions"],
  ["app/bedbug/laundry/page.tsx", "/bedbug/laundry"],
  ["app/bedbug/mattress-day/page.tsx", "/bedbug/mattress-day"],
  ["app/bedbug/rules/page.tsx", "/bedbug/rules"],
  ["app/bedbug/bedroom/page.tsx", "/bedbug/bedroom"],
  ["app/bedbug/morning/page.tsx", "/bedbug/morning"],
  ["app/bedbug/worried/page.tsx", "/bedbug/worried"],
  ["app/bedbug/why/page.tsx", "/bedbug/why"],
  ["app/bedbug/timetable/page.tsx", "/bedbug/timetable"],
  ["app/bedbug/bites/page.tsx", "/bedbug/bites"],
];

const contextChunks = await Promise.all(
  PAGES.map(async ([path, label]) => {
    try {
      const content = await readFile(path, "utf8");
      return `## ${label}\n${content}`;
    } catch (err) {
      console.warn(`Skipping ${path}: ${err.message}`);
      return null;
    }
  }),
);
const contextBlock = [
  "# THE BED BUG PLAN — SOURCE OF TRUTH",
  ...contextChunks.filter(Boolean),
].join("\n\n");

// ─── prompts ──────────────────────────────────────────────────────────────

const personaForMom = `You are Ben, replying to a question your 76-year-old mom Susie just texted. She lives alone in another state, is mobile but gets confused and overwhelmed easily, and is going through a bed bug remediation plan you and she planned together. The full plan and the app pages she sees are provided as context.

VOICE & TONE:
- Warm, plain language. The way you'd actually text your mom.
- No medical jargon, no condescension, no "great question!" filler.
- Short. Aim for under 1000 characters total. Reply will be sent as SMS or email — concision matters.
- If she sounds distressed or scared, lead with one sentence acknowledging that before the answer.
- Use the bed bug plan as the source of truth. Don't make up advice that isn't in the plan.`;

const personaForKarl = `You are an assistant replying to Karl, who built this system. He's testing or asking a quick admin question via the SMS Q&A loop. The reply will land at his email, not Mom's. Concise; technical OK.`;

const decisionRubric = `RESPONSE FORMAT — pick exactly one, starting on the first line:

  ANSWER
  <on the lines below, your answer text — under 1000 chars>

  ESCALATE: <one-sentence reason>
    Use when the question is on-topic but the right answer needs careful
    judgment, nuance, or precise reading of the plan that a stronger model
    would handle better. Sonnet 4.6 will retry with the same context.

  NEEDS-HUMAN: <one-sentence reason>
    Use when:
    - The question is medical (bites, allergic reactions, symptoms).
    - The sender sounds in physical danger or describes an emergency.
    - The question is outside the bed bug plan entirely (bills, family
      conflict, mental-health crisis).
    - The answer requires real-world state Karl knows but you don't ("did
      the package arrive?", "did you call the landlord?").

Default to ANSWER when the plan / items / questions pages cover it confidently.
Default to ESCALATE when you're not sure but a stronger model could handle it.
Default to NEEDS-HUMAN when no model should answer this one alone.

When replying with ANSWER: no greetings, no signoff, no markdown headings,
no quoting her question back — just the answer.`;

const persona = isKarl ? personaForKarl : personaForMom;
const systemBlocks = [
  { type: "text", text: persona },
  { type: "text", text: decisionRubric },
  { type: "text", text: contextBlock, cache_control: { type: "ephemeral" } },
];

function classify(text) {
  const firstLine = text.split("\n")[0].trim();
  const rest = text.slice(firstLine.length).trim();
  if (/^ANSWER$/i.test(firstLine) && rest) return { kind: "answer", body: rest };
  if (/^ANSWER\b/i.test(firstLine)) {
    // model wrote "ANSWER ..." on one line — treat the rest of the first line as body
    const body = firstLine.replace(/^ANSWER:?\s*/i, "").trim();
    if (body) return { kind: "answer", body: body + (rest ? "\n" + rest : "") };
  }
  if (/^NEEDS-HUMAN/i.test(firstLine)) {
    return {
      kind: "needs-human",
      reason: firstLine.replace(/^NEEDS-HUMAN:?\s*/i, "").trim(),
    };
  }
  if (/^ESCALATE/i.test(firstLine)) {
    return {
      kind: "escalate",
      reason: firstLine.replace(/^ESCALATE:?\s*/i, "").trim(),
    };
  }
  return {
    kind: "escalate",
    reason: `(unexpected first line: "${firstLine.slice(0, 80)}")`,
  };
}

// ─── tier 1: Haiku ────────────────────────────────────────────────────────

console.log("Calling Haiku 4.5...");
let haikuResult;
try {
  haikuResult = await callClaude(MODEL_HAIKU, systemBlocks, question);
} catch (err) {
  console.error(`Haiku call failed: ${err.message}`);
  await postComment(
    GH_TOKEN_BOT,
    issueNumber,
    `**🚨 Auto-answer failed (Haiku)**\n\n${err.message}\n@karlmarx — please reply manually.`,
  );
  await addLabel(issueNumber, "needs-human");
  process.exit(1);
}
const haikuUsd = priceCallUsd(MODEL_HAIKU, haikuResult.usage);
console.log(
  `Haiku usage: ${JSON.stringify(haikuResult.usage)} → $${haikuUsd.toFixed(6)}`,
);
const haikuDecision = classify(haikuResult.text);

if (haikuDecision.kind === "answer") {
  console.log("Haiku answered. Posting.");
  await postComment(GH_TOKEN_ANSWER, issueNumber, haikuDecision.body);
  await postCostComment(issueNumber, MODEL_HAIKU, haikuResult.usage, haikuUsd, "answer");
  process.exit(0);
}

if (haikuDecision.kind === "needs-human") {
  console.log(`Haiku → needs-human: ${haikuDecision.reason}`);
  await postComment(
    GH_TOKEN_BOT,
    issueNumber,
    `**🚨 Auto-answer needs a human**\n\n${haikuDecision.reason || "(no reason given)"}\n\n@karlmarx — please reply. The next non-bot comment will be sent to ${isKarl ? "Karl" : "Mom"}.`,
  );
  await addLabel(issueNumber, "needs-human");
  await postCostComment(issueNumber, MODEL_HAIKU, haikuResult.usage, haikuUsd, "needs-human");
  process.exit(0);
}

// ─── tier 2: Sonnet ───────────────────────────────────────────────────────

console.log(`Escalating to Sonnet 4.6: ${haikuDecision.reason}`);
const spendBeforeSonnet = spendSoFar + haikuUsd;
if (spendBeforeSonnet >= COST_CAP_DAILY_USD) {
  console.log("Cap hit before Sonnet escalation; routing to human.");
  await postComment(
    GH_TOKEN_BOT,
    issueNumber,
    `**🚨 Daily cap reached before Sonnet escalation**\n\nHaiku flagged this for escalation but today's spend is $${spendBeforeSonnet.toFixed(4)} (cap $${COST_CAP_DAILY_USD.toFixed(2)}). @karlmarx — please answer manually.\n\n_Haiku's reason: ${haikuDecision.reason}_`,
  );
  await addLabel(issueNumber, "needs-human");
  await postCostComment(issueNumber, MODEL_HAIKU, haikuResult.usage, haikuUsd, "escalate-capped");
  process.exit(0);
}

let sonnetResult;
try {
  sonnetResult = await callClaude(MODEL_SONNET, systemBlocks, question);
} catch (err) {
  console.error(`Sonnet call failed: ${err.message}`);
  await postCostComment(issueNumber, MODEL_HAIKU, haikuResult.usage, haikuUsd, "escalate-failed");
  await postComment(
    GH_TOKEN_BOT,
    issueNumber,
    `**🚨 Sonnet escalation failed**\n\n${err.message}\n@karlmarx — please reply manually.`,
  );
  await addLabel(issueNumber, "needs-human");
  process.exit(1);
}
const sonnetUsd = priceCallUsd(MODEL_SONNET, sonnetResult.usage);
console.log(
  `Sonnet usage: ${JSON.stringify(sonnetResult.usage)} → $${sonnetUsd.toFixed(6)}`,
);
await postCostComment(issueNumber, MODEL_HAIKU, haikuResult.usage, haikuUsd, "escalated");

const sonnetDecision = classify(sonnetResult.text);
if (sonnetDecision.kind === "answer") {
  console.log("Sonnet answered. Posting.");
  await postComment(GH_TOKEN_ANSWER, issueNumber, sonnetDecision.body);
  await postCostComment(issueNumber, MODEL_SONNET, sonnetResult.usage, sonnetUsd, "answer");
  process.exit(0);
}

const sonnetReason = sonnetDecision.reason || `(unexpected: "${sonnetResult.text.slice(0, 80)}")`;
console.log(`Sonnet → human: ${sonnetReason}`);
await postComment(
  GH_TOKEN_BOT,
  issueNumber,
  `**🚨 Both models routed this to human**\n\nHaiku: ${haikuDecision.reason}\nSonnet: ${sonnetReason}\n\n@karlmarx — please reply.`,
);
await addLabel(issueNumber, "needs-human");
await postCostComment(issueNumber, MODEL_SONNET, sonnetResult.usage, sonnetUsd, "needs-human");
