#!/usr/bin/env node
// Auto-answer a mom-question / karl-question issue using Claude Sonnet 4.6.
//
// Two run modes:
//   1. CI (GitHub Actions): all input supplied via env vars (ISSUE_NUMBER,
//      ISSUE_BODY, ISSUE_TITLE, ISSUE_LABELS, GITHUB_REPOSITORY).
//   2. Local: pass `--issue N`, the script fetches the issue itself.
//
// Posts the answer as a real-user comment via GH_TOKEN_ANSWER (so it triggers
// answer-mom.yml) or as a Bot escalation via GH_TOKEN_BOT (which doesn't).

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

let issueNumber, issueBody, issueLabels;

if (issueArg) {
  // Local mode: fetch the issue from GitHub
  issueNumber = parseInt(issueArg, 10);
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}`, {
    headers: {
      Authorization: `Bearer ${GH_TOKEN_ANSWER}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "mom-bedbug-auto-answer",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch issue #${issueNumber}: ${res.status} ${await res.text()}`);
  }
  const issue = await res.json();
  issueBody = issue.body ?? "";
  issueLabels = (issue.labels ?? []).map((l) => l.name);
} else {
  // CI mode: read from env
  issueNumber = parseInt(requiredEnv("ISSUE_NUMBER"), 10);
  issueBody = requiredEnv("ISSUE_BODY");
  issueLabels = JSON.parse(requiredEnv("ISSUE_LABELS"));
}

if (!issueLabels.includes("mom-question") && !issueLabels.includes("karl-question")) {
  console.log("Issue is not a mom-question or karl-question; nothing to do.");
  process.exit(0);
}

const isKarl = issueLabels.includes("karl-question");
const originator = isKarl ? "karl" : "mom";

// Strip the "**From:** ..." metadata block; the question is after the `---`.
function extractQuestion(body) {
  const idx = body.indexOf("\n---\n");
  return idx === -1 ? body.trim() : body.slice(idx + 5).trim();
}
const question = extractQuestion(issueBody);
console.log(`Issue #${issueNumber} (${originator}) — question: ${question.slice(0, 120)}${question.length > 120 ? "…" : ""}`);

// Load all the context — plan.md is the source of truth, the page TSX files
// give the model voice/tone reference.
const [planMd, itemsTsx, overwhelmedTsx, questionsTsx, laundryTsx, mattressDayTsx, rulesTsx, bedroomTsx] =
  await Promise.all([
    readFile("docs/plan.md", "utf8"),
    readFile("app/bedbug/items/page.tsx", "utf8"),
    readFile("app/bedbug/overwhelmed/page.tsx", "utf8"),
    readFile("app/bedbug/questions/page.tsx", "utf8"),
    readFile("app/bedbug/laundry/page.tsx", "utf8"),
    readFile("app/bedbug/mattress-day/page.tsx", "utf8"),
    readFile("app/bedbug/rules/page.tsx", "utf8"),
    readFile("app/bedbug/bedroom/page.tsx", "utf8"),
  ]);

const contextBlock = [
  "# THE BED BUG PLAN — SOURCE OF TRUTH",
  "",
  "## docs/plan.md",
  planMd,
  "",
  "## /bedbug/items (item-by-item reference; what Mom sees in the app)",
  itemsTsx,
  "",
  "## /bedbug/overwhelmed (the calming + reality-check page)",
  overwhelmedTsx,
  "",
  "## /bedbug/questions (FAQ from prior questions)",
  questionsTsx,
  "",
  "## /bedbug/laundry (the 14-step laundry wizard)",
  laundryTsx,
  "",
  "## /bedbug/mattress-day (Thursday wizard)",
  mattressDayTsx,
  "",
  "## /bedbug/rules (the 5 rules)",
  rulesTsx,
  "",
  "## /bedbug/bedroom (entry/exit ritual)",
  bedroomTsx,
].join("\n");

const personaForMom = `You are Ben, replying to a question your 76-year-old mom Susie just texted. She lives alone in another state, is mobile but gets confused and overwhelmed easily, and is going through a bed bug remediation plan you and she planned together. The full plan and the app pages she sees are provided as context.

VOICE & TONE:
- Warm, plain language. The way you'd actually text your mom.
- No medical jargon, no condescension, no "great question!" filler.
- Short. Aim for under 1000 characters total. Reply will be sent as SMS or email — concision matters.
- If she sounds distressed or scared, lead with one sentence acknowledging that before the answer.
- Use the bed bug plan as the source of truth. Don't make up advice that isn't supported by the plan.

WHEN TO ESCALATE INSTEAD OF ANSWERING:
Respond with EXACTLY \`ESCALATE: <one-sentence reason>\` (and nothing else) when:
- The question is medical (bites, allergic reactions, symptoms — anything that should go to a doctor).
- She sounds in physical danger or describes a non-bed-bug emergency.
- The question is outside the bed bug plan entirely (bills, family conflict, mental health crisis).
- The answer requires information you don't have (e.g. "did the package arrive?", "did you call the landlord?").
- The question is genuinely outside what the plan or items/questions pages cover, and answering would require fresh judgment.

Otherwise, respond with the answer text only — no greetings, no signoff, no markdown headings, no quoting her question back. Just the answer she'd want to read.`;

const personaForKarl = `You are an assistant replying to Karl, who built this system. He's testing or asking a quick admin question via the SMS Q&A loop. The reply will land at his email (k@93.fyi), not Mom's.

VOICE & TONE:
- Concise, technical OK. No need to be warm.
- Use the bed bug plan as the source of truth.

WHEN TO ESCALATE:
Respond with \`ESCALATE: <reason>\` if the question requires information you don't have (current state, future plans, opinions about non-bug things).

Otherwise, respond with the answer text only.`;

const personaPrompt = isKarl ? personaForKarl : personaForMom;

const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    thinking: { type: "disabled" },
    output_config: { effort: "low" },
    system: [
      { type: "text", text: personaPrompt },
      { type: "text", text: contextBlock, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: question }],
  }),
});

if (!apiRes.ok) {
  const errText = await apiRes.text();
  console.error(`Anthropic ${apiRes.status}: ${errText.slice(0, 500)}`);
  await postEscalation(`Anthropic API error ${apiRes.status}. Karl, please answer manually.`);
  process.exit(1);
}

const data = await apiRes.json();
const reply = (data.content?.[0]?.text ?? "").trim();
console.log(`Usage: ${JSON.stringify(data.usage ?? {})}`);

if (!reply) {
  await postEscalation("Anthropic returned empty content.");
  process.exit(1);
}

if (reply.toUpperCase().startsWith("ESCALATE:")) {
  const reason = reply.replace(/^escalate:\s*/i, "").trim();
  console.log(`Escalating: ${reason}`);
  await postEscalation(reason);
} else {
  console.log(`Posting answer (${reply.length} chars)`);
  await postAnswer(reply);
}

async function postAnswer(text) {
  // Use the user PAT — comment author is NOT a Bot, so answer-mom.yml fires.
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GH_TOKEN_ANSWER}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "mom-bedbug-auto-answer",
    },
    body: JSON.stringify({ body: text }),
  });
  if (!res.ok) {
    throw new Error(`Failed to post answer: ${res.status} ${await res.text()}`);
  }
}

async function postEscalation(reason) {
  const dest = isKarl ? "Karl" : "Mom";
  const body = `**🚨 Auto-answer escalated**\n\n${reason}\n\n@karlmarx — please reply to this issue with your answer. The next non-bot comment will be sent to ${dest}.`;
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GH_TOKEN_BOT}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "mom-bedbug-auto-answer-bot",
    },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    throw new Error(`Failed to post escalation: ${res.status} ${await res.text()}`);
  }
}
