#!/usr/bin/env node
// Self-review yesterday's Sonnet 4.6 answers.
//
// For each Sonnet "answer" cost comment posted in the last UTC day, fetch
// the question + the answer and ask Sonnet to critique it against the plan.
// If the critique flags a meaningful flaw and proposes a corrected answer,
// post the correction as a comment on the issue — which fires answer-mom.yml
// and sends Mom an updated SMS/email.
//
// Capped by count (MAX_REVIEWS_PER_DAY, default 5) since each review is
// roughly one Sonnet call (~$0.02). Reviews participate in the daily cost
// cap via COST_CAP_DAILY_USD — if the cap is already hit when the cron runs,
// reviews are skipped.

import { readFile } from "node:fs/promises";

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
  process.env.COST_CAP_DAILY_USD ?? "0.10",
);
const MAX_REVIEWS_PER_DAY = Number.parseInt(
  process.env.MAX_REVIEWS_PER_DAY ?? "5",
  10,
);

const MODEL_SONNET = "claude-sonnet-4-6";
const PRICING_SONNET = {
  input: 3.0, cache_read: 0.30, cache_write: 3.75, output: 15.0,
};

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "mom-bedbug-self-review",
  };
}

async function postComment(token, issueNumber, body) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: { ...ghHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    },
  );
  if (!res.ok) throw new Error(`Comment failed: ${res.status} ${await res.text()}`);
}

async function fetchIssueComments(issueNumber) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments?per_page=100`,
    { headers: ghHeaders(GH_TOKEN_BOT) },
  );
  if (!res.ok) throw new Error(`Fetch comments failed: ${res.status}`);
  return res.json();
}

async function fetchIssue(issueNumber) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${issueNumber}`,
    { headers: ghHeaders(GH_TOKEN_BOT) },
  );
  if (!res.ok) throw new Error(`Fetch issue failed: ${res.status}`);
  return res.json();
}

function extractQuestion(issueBody) {
  const idx = issueBody.indexOf("\n---\n");
  return idx === -1 ? issueBody.trim() : issueBody.slice(idx + 5).trim();
}

function priceSonnet(usage) {
  const cents =
    (usage.input_tokens ?? 0) * PRICING_SONNET.input +
    (usage.cache_creation_input_tokens ?? 0) * PRICING_SONNET.cache_write +
    (usage.cache_read_input_tokens ?? 0) * PRICING_SONNET.cache_read +
    (usage.output_tokens ?? 0) * PRICING_SONNET.output;
  return cents / 1_000_000;
}

async function callSonnet(system, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL_SONNET,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 500)}`);
  }
  const data = await res.json();
  return {
    text: (data.content?.[0]?.text ?? "").trim(),
    usage: data.usage ?? {},
  };
}

async function postCostComment(issueNumber, usage, usd, decision) {
  const payload = {
    model: "sonnet-4-6",
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
  await postComment(GH_TOKEN_BOT, issueNumber, `<!-- cost:${JSON.stringify(payload)} -->`);
}

// ─── window: yesterday UTC ────────────────────────────────────────────────────────

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const sinceISO = yesterday.toISOString();

console.log(`Self-review window: ${yesterday.toISOString()} → ${today.toISOString()}`);
console.log(`Cap=$${COST_CAP_DAILY_USD.toFixed(2)} max_reviews=${MAX_REVIEWS_PER_DAY}`);

// ─── find Sonnet "answer" cost comments from yesterday ─────────────────────

const sonnetAnswers = [];
let page = 1;
let todaysSpend = 0;
while (page <= 10) {
  const url = `https://api.github.com/repos/${REPO}/issues/comments?since=${encodeURIComponent(sinceISO)}&per_page=100&page=${page}&sort=created&direction=asc`;
  const res = await fetch(url, { headers: ghHeaders(GH_TOKEN_BOT) });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  const comments = await res.json();
  if (!Array.isArray(comments) || comments.length === 0) break;
  for (const c of comments) {
    const ts = new Date(c.created_at);
    const m = (c.body ?? "").match(/<!-- cost:(\{[^>]+\}) -->/);
    if (!m) continue;
    let parsed;
    try { parsed = JSON.parse(m[1]); } catch { continue; }
    // Count today's spend toward the cap (the review job participates).
    if (ts >= today && typeof parsed.usd === "number") {
      todaysSpend += parsed.usd;
    }
    // Find yesterday's Sonnet answers (the candidates to review).
    if (
      ts >= yesterday && ts < today &&
      parsed.model === "sonnet-4-6" &&
      parsed.decision === "answer" &&
      c.issue_url
    ) {
      const issueNumber = Number.parseInt(c.issue_url.split("/").pop() ?? "0", 10);
      if (issueNumber > 0) {
        sonnetAnswers.push({ issueNumber, costCommentId: c.id, costAt: ts });
      }
    }
  }
  if (comments.length < 100) break;
  page += 1;
}

console.log(`Candidates: ${sonnetAnswers.length} Sonnet answers yesterday. Today's spend: $${todaysSpend.toFixed(4)}`);

if (sonnetAnswers.length === 0) {
  console.log("Nothing to review.");
  process.exit(0);
}
if (todaysSpend >= COST_CAP_DAILY_USD) {
  console.log(`Cap already hit today ($${todaysSpend.toFixed(4)}). Skipping all reviews.`);
  process.exit(0);
}

// Cap to MAX_REVIEWS_PER_DAY; pick newest first (most likely to still matter).
sonnetAnswers.sort((a, b) => b.costAt.getTime() - a.costAt.getTime());
const candidates = sonnetAnswers.slice(0, MAX_REVIEWS_PER_DAY);

// ─── load context once ───────────────────────────────────────────────────────

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
      return `## ${label}\n${await readFile(path, "utf8")}`;
    } catch {
      return null;
    }
  }),
);
const contextBlock = [
  "# THE BED BUG PLAN — SOURCE OF TRUTH",
  ...contextChunks.filter(Boolean),
].join("\n\n");

const reviewerPersona = `You are an independent reviewer auditing answers that Ben (the same author you'd otherwise be) just sent to his mom over SMS. You see the plan, the question, and the answer that was sent. Your job: catch flaws.

What counts as a flaw:
- The answer contradicts the plan or the items/questions pages.
- The answer omits a critical instruction the plan specifies.
- The answer gives advice the plan explicitly warns against (e.g. retail bed bug sprays, freezer use, encasement vs SafeRest confusion).
- The answer recommends a medical action the plan defers (it should never replace a doctor).

What does NOT count as a flaw:
- Brevity. Mom's reply is meant to be short. Don't critique for missing detail unless the missing detail is safety-relevant.
- Tone preferences. The voice is Ben's; don't rewrite for style.
- Speculation. If the plan doesn't address it, the original answer's silence is fine.

Be strict but specific — small wording quibbles waste tokens and confuse Mom with a "correction" that doesn't matter.`;

const reviewerRubric = `RESPONSE FORMAT — pick exactly one, starting on the first line:

  OK
  (nothing else needed)

  CORRECT: <one-sentence reason>
  <on the lines below, the corrected reply text Mom should receive
  instead — start with "Quick correction —" so she knows it's an update.
  Under 1000 chars.>

Default to OK unless there's a real, plan-grounded problem worth correcting
mid-stream. A correction means Mom gets a second SMS about the same topic;
that's only worth doing for real safety or factual issues.`;

const systemBlocks = [
  { type: "text", text: reviewerPersona },
  { type: "text", text: reviewerRubric },
  { type: "text", text: contextBlock, cache_control: { type: "ephemeral" } },
];

// ─── review loop ─────────────────────────────────────────────────────────────

let corrected = 0;
let okCount = 0;
let skipped = 0;

for (const candidate of candidates) {
  if (todaysSpend >= COST_CAP_DAILY_USD) {
    console.log(`Cap hit at $${todaysSpend.toFixed(4)}; stopping.`);
    break;
  }
  const { issueNumber } = candidate;

  let issue, comments;
  try {
    [issue, comments] = await Promise.all([
      fetchIssue(issueNumber),
      fetchIssueComments(issueNumber),
    ]);
  } catch (err) {
    console.warn(`Issue #${issueNumber}: fetch failed (${err.message}); skipping`);
    skipped += 1;
    continue;
  }
  // Skip if the issue's been escalated to a human or has multiple answers — no point.
  const labels = (issue.labels ?? []).map((l) => l.name);
  if (labels.includes("needs-human") || labels.includes("reviewed")) {
    console.log(`#${issueNumber}: labeled needs-human/reviewed; skipping`);
    skipped += 1;
    continue;
  }
  // The answer is the User-type comment immediately before the cost comment.
  // Find the cost comment then walk back.
  const idx = comments.findIndex((c) => c.id === candidate.costCommentId);
  if (idx <= 0) {
    console.log(`#${issueNumber}: couldn't locate answer comment; skipping`);
    skipped += 1;
    continue;
  }
  let answer = null;
  for (let i = idx - 1; i >= 0; i -= 1) {
    const c = comments[i];
    if (c.user?.type !== "Bot") {
      answer = c;
      break;
    }
  }
  if (!answer) {
    console.log(`#${issueNumber}: no preceding user-type comment; skipping`);
    skipped += 1;
    continue;
  }

  const question = extractQuestion(issue.body ?? "");
  const reviewerInput = [
    "Question Mom asked:",
    question,
    "",
    "Answer Ben sent:",
    answer.body ?? "",
  ].join("\n");

  let reviewResult;
  try {
    reviewResult = await callSonnet(systemBlocks, reviewerInput);
  } catch (err) {
    console.warn(`#${issueNumber}: review call failed (${err.message})`);
    skipped += 1;
    continue;
  }
  const usd = priceSonnet(reviewResult.usage);
  todaysSpend += usd;

  const firstLine = reviewResult.text.split("\n")[0].trim();
  const rest = reviewResult.text.slice(firstLine.length).trim();

  if (/^OK\b/i.test(firstLine)) {
    console.log(`#${issueNumber}: OK ($${usd.toFixed(6)})`);
    await postCostComment(issueNumber, reviewResult.usage, usd, "self-review-ok");
    okCount += 1;
    continue;
  }
  if (/^CORRECT/i.test(firstLine)) {
    const correctionText = rest || `Quick correction — earlier I told you something that wasn't quite right. Let me fix it: ${firstLine.replace(/^CORRECT:?\s*/i, "")}`;
    console.log(`#${issueNumber}: posting correction ($${usd.toFixed(6)})`);
    // Post as Karl-PAT (user-type) so answer-mom.yml fires and ships it.
    try {
      await postComment(GH_TOKEN_ANSWER, issueNumber, correctionText);
      await postCostComment(issueNumber, reviewResult.usage, usd, "self-review-correct");
      corrected += 1;
    } catch (err) {
      console.warn(`#${issueNumber}: failed to post correction (${err.message})`);
      await postCostComment(issueNumber, reviewResult.usage, usd, "self-review-correct-failed");
      skipped += 1;
    }
    continue;
  }
  // Unexpected format — log and skip.
  console.log(`#${issueNumber}: unexpected review output "${firstLine.slice(0, 60)}"; skipping`);
  await postCostComment(issueNumber, reviewResult.usage, usd, "self-review-malformed");
  skipped += 1;
}

console.log(
  `Done. Reviewed=${okCount + corrected} ok=${okCount} corrected=${corrected} skipped=${skipped}`,
);
console.log(`Spend after run: $${todaysSpend.toFixed(4)}`);
