#!/usr/bin/env node
// Daily cost summary — no Anthropic calls, just sums the bot cost comments
// posted in the last UTC day and emails the total to KARL_EMAIL via Resend.
//
// Runs on a daily cron. Designed to replace the polling Claude-Code routine
// that's hitting the 15/day limit; this one is pure arithmetic over GitHub
// issue comments, so it never bills Anthropic.

const requiredEnv = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env var: ${k}`);
  return v;
};

const GH_TOKEN = requiredEnv("GH_TOKEN");
const RESEND_API_KEY = requiredEnv("RESEND_API_KEY");
const KARL_EMAIL = requiredEnv("KARL_EMAIL");
const RESEND_FROM = process.env.RESEND_FROM ?? "ben@bedbug.93.fyi";
const REPO = process.env.GITHUB_REPOSITORY ?? "karlmarx/mom-93fyi";
const COST_CAP_DAILY_USD = Number.parseFloat(
  process.env.COST_CAP_DAILY_USD ?? "0.10",
);

// Window: previous full UTC day [yesterday 00:00, today 00:00).
const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const sinceISO = yesterday.toISOString();
const yesterdayLabel = yesterday.toISOString().slice(0, 10);

console.log(`Window: ${yesterday.toISOString()} → ${today.toISOString()}`);

const records = [];
let page = 1;
while (page <= 10) {
  const url = `https://api.github.com/repos/${REPO}/issues/comments?since=${encodeURIComponent(sinceISO)}&per_page=100&page=${page}&sort=created&direction=asc`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "mom-bedbug-cost-summary",
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  const comments = await res.json();
  if (!Array.isArray(comments) || comments.length === 0) break;
  for (const c of comments) {
    const ts = new Date(c.created_at);
    if (ts < yesterday || ts >= today) continue;
    const m = (c.body ?? "").match(/<!-- cost:(\{[^>]+\}) -->/);
    if (!m) continue;
    try {
      const parsed = JSON.parse(m[1]);
      parsed.issue = c.issue_url?.split("/").pop();
      records.push(parsed);
    } catch {
      // skip malformed
    }
  }
  if (comments.length < 100) break;
  page += 1;
}

const byModel = {};
let totalUsd = 0;
const decisions = {};
const issueSet = new Set();
for (const r of records) {
  const m = r.model ?? "unknown";
  byModel[m] = byModel[m] ?? {
    calls: 0, usd: 0, in: 0, cache_read: 0, cache_write: 0, out: 0,
  };
  byModel[m].calls += 1;
  byModel[m].usd += r.usd ?? 0;
  byModel[m].in += r.tokens?.in ?? 0;
  byModel[m].cache_read += r.tokens?.cache_read ?? 0;
  byModel[m].cache_write += r.tokens?.cache_write ?? 0;
  byModel[m].out += r.tokens?.out ?? 0;
  totalUsd += r.usd ?? 0;
  const d = r.decision ?? "other";
  decisions[d] = (decisions[d] ?? 0) + 1;
  if (r.issue) issueSet.add(r.issue);
}

const monthlyProjection = totalUsd * 30;
const capHit = totalUsd >= COST_CAP_DAILY_USD;

const lines = [];
lines.push(`Mom-bedbug auto-answer daily summary — ${yesterdayLabel} UTC`);
lines.push("");
lines.push(`Total spend: $${totalUsd.toFixed(4)}   (cap $${COST_CAP_DAILY_USD.toFixed(2)}${capHit ? " — HIT" : ""})`);
lines.push(`Projected monthly @ this rate: $${monthlyProjection.toFixed(2)}`);
lines.push(`Distinct issues handled: ${issueSet.size}`);
lines.push(`Total model calls: ${records.length}`);
lines.push(
  `Decisions: ${Object.entries(decisions).map(([k, v]) => `${k}=${v}`).join(", ") || "(none)"}`,
);
lines.push("");
if (records.length === 0) {
  lines.push("No auto-answer activity yesterday.");
} else {
  lines.push("By model:");
  for (const [m, s] of Object.entries(byModel)) {
    lines.push(`  ${m}: ${s.calls} calls, $${s.usd.toFixed(4)}`);
    lines.push(`    in=${s.in}  cache_read=${s.cache_read}  cache_write=${s.cache_write}  out=${s.out}`);
  }
}
lines.push("");
lines.push("Notes:");
lines.push("- Caps and pricing live in .github/scripts/answer-mom.mjs.");
lines.push("- This summary calls no Anthropic API; it only reads GitHub bot");
lines.push("  comments shaped <!-- cost:{...} --> on mom-question / karl-question");
lines.push("  issues, sums them, and emails the result.");

const text = lines.join("\n");
console.log(text);

const subject = capHit
  ? `[mom-bedbug] $${totalUsd.toFixed(4)} on ${yesterdayLabel} — CAP HIT`
  : totalUsd === 0
  ? `[mom-bedbug] No activity ${yesterdayLabel}`
  : `[mom-bedbug] $${totalUsd.toFixed(4)} on ${yesterdayLabel}`;

const emailRes = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: `Bedbug Cost <${RESEND_FROM}>`,
    to: [KARL_EMAIL],
    subject,
    text,
  }),
});
if (!emailRes.ok) {
  throw new Error(`Resend ${emailRes.status}: ${await emailRes.text()}`);
}
console.log("Summary emailed.");
