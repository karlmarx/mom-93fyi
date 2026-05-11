# Auto-answer agent

Event-driven replacement for the polling Claude-Code routine (which kept
hitting the 15-runs/day cap). When Mom or Karl texts the Twilio number, an
issue is opened with a `mom-question` or `karl-question` label. The
`auto-answer.yml` workflow fires on `issues.opened`, tries Haiku 4.5, and
escalates to Sonnet 4.6 only when needed.

## Flow

```
Mom (SMS) → Twilio → /api/bedbug/sms-inbound → issue opens with `mom-question`
                                                         ↓
                                       .github/workflows/auto-answer.yml
                                                         ↓
                          .github/scripts/answer-mom.mjs (Node 20, no deps)
                                                         ↓
                          ┌─ Haiku 4.5 (~$0.001/call cached) ──┐
                          │  ANSWER         → post answer comment (user PAT)
                          │  ESCALATE       → Sonnet 4.6 retry (~$0.02/call)
                          │  NEEDS-HUMAN    → label `needs-human`, no Sonnet
                          └────────────────────────────────────┘
                                                         ↓
                              answer comment fires answer-mom.yml
                                                         ↓
                                       /api/bedbug/sms-outbound
                                                         ↓
                                          Twilio (SMS) or Resend (email)
```

Each model call also posts a small `<!-- cost:{...} -->` HTML comment as the
github-actions bot. answer-mom.yml ignores Bot comments, so the cost
comments are invisible to humans and never get sent as SMS. The daily
summary cron reads them and emails the rollup.

## Hard daily cost cap

Before any API call the script sums today's bot cost comments. If today's
spend ≥ `COST_CAP_DAILY_USD` (default $0.25), it skips both models, labels
the issue `needs-human`, and stops. The cap is also re-checked between the
Haiku and Sonnet calls so a single late-day escalation can't overshoot.

| Daily cap | Approximate ceiling                      |
|-----------|------------------------------------------|
| $0.10     | ~100 Haiku answers OR ~5 Sonnet escalations |
| $0.25     | ~250 Haiku answers OR ~12 Sonnet escalations |
| $1.00     | ~1000 Haiku answers OR ~50 Sonnet escalations |

Override per-repo via Settings → Variables → Actions → `COST_CAP_DAILY_USD`.

## Required secrets (Repo → Settings → Secrets and variables → Actions)

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Console → Plans & Billing → enable, then API Keys → create |
| `GH_TOKEN_ANSWER` | Fine-grained PAT on this repo, **Issues: write**. Must NOT be `GITHUB_TOKEN` — answer-mom.yml filters out Bot authors, so answers need a user-type identity to fire it. |
| `RESEND_API_KEY` | For the daily summary email (same key Vercel already uses) |
| `KARL_EMAIL` | Where the daily summary lands |

## Required label

Create the `needs-human` label once at
`https://github.com/karlmarx/mom-93fyi/labels`. Used when the model abstains
or the cap is hit. The script will error if it's missing.

## Daily cost summary

`cost-summary.yml` runs at 13:00 UTC (≈9 AM ET). It sums the previous UTC
day's `<!-- cost:{...} -->` bot comments and emails the rollup via Resend:

```
Mom-bedbug auto-answer daily summary — 2026-05-11 UTC

Total spend: $0.0083   (cap $0.25)
Projected monthly @ this rate: $0.25
Distinct issues handled: 4
Total model calls: 5
Decisions: answer=4, escalated=1

By model:
  haiku-4-5: 5 calls, $0.0064
    in=412  cache_read=27_300  cache_write=6_800  out=523
  sonnet-4-6: 1 call, $0.0019
    in=82  cache_read=0  cache_write=6_800  out=98
```

The summary job calls no Anthropic API — pure GitHub-API arithmetic — so it
can run every day with zero variable cost beyond the Resend free tier.

## After deploying — once

1. Enable Anthropic billing (console.anthropic.com → Plans & Billing,
   add a card, top up $5–10 to start).
2. Create the `ANTHROPIC_API_KEY` and `GH_TOKEN_ANSWER` repo secrets.
3. Ensure `RESEND_API_KEY` and `KARL_EMAIL` are repo secrets too (not
   just Vercel env vars).
4. Create the `needs-human` label in the repo.
5. **Disable the old Claude-Code routine** that's hitting the 15/day cap.
   The agent-bridge endpoint (`app/api/bedbug/agent-bridge/route.ts`) can
   stay — useful as a manual fallback — but the scheduled routine that
   polls it is now redundant.

## Test locally

```bash
# .env: ANTHROPIC_API_KEY=sk-...
scripts/answer-local.sh 42       # re-answer issue #42
```

Local runs participate in the cost cap — they post cost comments same as
CI, so they show up in the daily summary.

## Pricing (as of 2026-05)

| Model | Input | Cache read | Cache write (5 min) | Output |
|---|---|---|---|---|
| Haiku 4.5 | $1/M | $0.10/M | $1.25/M | $5/M |
| Sonnet 4.6 | $3/M | $0.30/M | $3.75/M | $15/M |

Per-question cost with full plan context cached:
- Haiku answer: ~$0.001 (cache hit) or ~$0.009 (first call, cache write)
- Sonnet escalation: ~$0.020 (cache write — separate cache from Haiku)

Numbers will drift; update `PRICING` in `answer-mom.mjs` when Anthropic
changes pricing.

## Deferred phases

- **Phase 3** — scheduled "self-review" cron that re-reads recent Sonnet
  answers and emails Mom a correction if it finds a flaw.
- **Phase 4** — inbound email so Karl can reply to the daily summary or to
  individual issue notifications and have it land as an issue comment.
