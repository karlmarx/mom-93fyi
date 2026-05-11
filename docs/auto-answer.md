# Auto-answer agent

Event-driven replacement for the polling Claude-Code routine (which kept
hitting the 15-runs/day cap). Four scheduled / event-triggered workflows:

1. **`auto-answer.yml`** (event-driven, on `issues.opened`) — Haiku 4.5 →
   Sonnet 4.6 → human, with a hard daily $ cap. Sends Mom the answer.
2. **`cost-summary.yml`** (daily cron, no Anthropic) — sums yesterday's
   bot cost comments, emails the rollup to Karl via Resend.
3. **`self-review.yml`** (daily cron, Sonnet 4.6) — re-reads yesterday's
   Sonnet answers and emails Mom a correction if it finds a flaw.
4. **`/api/bedbug/email-inbound`** (Vercel route, Postmark webhook) — lets
   Karl reply to any outgoing email and have the body land as an issue
   comment, which fires answer-mom.yml and ships to Mom.

## Phase 1 — answer flow

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

Each model call also posts a `<!-- cost:{...} -->` HTML comment as the
github-actions bot. answer-mom.yml ignores Bot comments, so the cost
comments are invisible to humans and never get sent as SMS. The summary
and review crons read them.

## Hard daily cost cap

Before any API call, the script sums today's bot cost comments. If today's
spend ≥ `COST_CAP_DAILY_USD` (default **$0.10**), it skips both models,
labels the issue `needs-human`, and stops. The cap is also re-checked
between the Haiku and Sonnet calls so a single late-day escalation can't
overshoot. Self-review also participates in this cap — if the cap is hit
by live answers earlier in the day, the review cron skips that day.

| Daily cap | Approximate ceiling                                   |
|-----------|-------------------------------------------------------|
| $0.10 (default) | ~100 Haiku answers OR ~5 Sonnet escalations    |
| $0.25     | ~250 Haiku answers OR ~12 Sonnet escalations          |
| $1.00     | ~1000 Haiku answers OR ~50 Sonnet escalations         |

Override via Settings → Variables → Actions → `COST_CAP_DAILY_USD`.

## Phase 2 — daily cost summary

`cost-summary.yml` runs at 13:00 UTC (≈9 AM ET). It sums the previous UTC
day's `<!-- cost:{...} -->` bot comments and emails the rollup via Resend:

```
Mom-bedbug auto-answer daily summary — 2026-05-11 UTC

Total spend: $0.0083   (cap $0.10)
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

## Phase 3 — daily self-review

`self-review.yml` runs at 15:00 UTC (≈11 AM ET). It walks yesterday's
Sonnet 4.6 answers (up to `MAX_REVIEWS_PER_DAY`, default 5) and asks
Sonnet to critique each one against the plan. Two possible outcomes per
answer:

- **OK** — nothing happens, just a `self-review-ok` cost comment for the
  summary.
- **CORRECT** — Sonnet posts a follow-up answer starting with "Quick
  correction —", which fires answer-mom.yml and ships a corrected SMS or
  email to Mom.

Per-review cost: ~$0.02 (Sonnet, cache write since the reviewer cache is
separate from the live-answer cache). With the default cap, that's
roughly 5 reviews/day before everything else stops.

The reviewer's rubric is strict — only safety/factual issues warrant a
correction. Mom shouldn't get a second SMS for a minor tone preference.

## Phase 4 — inbound email (Postmark)

`/api/bedbug/email-inbound` lets Karl reply to any outgoing email and have
the body land as an issue comment. That comment fires answer-mom.yml just
like an auto-answer would, so the reply ships to Mom.

How outbound emails carry the issue number:

- `sms-outbound` sets `reply_to: bedbug+<N>@inbound.93.fyi` and appends
  `[mom-bedbug #N]` to the subject.
- Karl replies to the email. His mail client keeps the `To` (or `Subject`)
  reference.
- Postmark receives the reply at `inbound.93.fyi`, POSTs JSON to
  `/api/bedbug/email-inbound`.
- The handler verifies Basic Auth, whitelists sender = `KARL_EMAIL`, pulls
  the issue number from `bedbug+<N>@…` (or, as fallback, from `#N` in the
  subject), and posts `StrippedTextReply` as a comment via the existing
  `GITHUB_TOKEN_INTAKE`.

### Postmark setup (one-time)

1. Sign up at postmarkapp.com (free for inbound up to 10k/mo).
2. Create an **Inbound Stream**. Set the webhook URL to
   `https://bedbug.93.fyi/api/bedbug/email-inbound` and configure Basic
   Auth credentials.
3. Either:
   - Use Postmark's default inbound domain
     (`<hash>.inbound.postmarkapp.com`) and update
     `POSTMARK_INBOUND_DOMAIN` accordingly, or
   - Point your own MX records at Postmark for `inbound.93.fyi`. Postmark
     publishes the MX target — usually `inbound.postmarkapp.com`.
4. Add these to Vercel env vars:

   | Variable | Purpose |
   |---|---|
   | `POSTMARK_INBOUND_USER` | Basic-auth user matching the webhook URL |
   | `POSTMARK_INBOUND_PASS` | Basic-auth password |
   | `POSTMARK_INBOUND_DOMAIN` | The hostname your `reply_to` should use (default `inbound.93.fyi`) |
   | `KARL_EMAIL` | Sender whitelist — only mail from this address is accepted |
   | `GITHUB_TOKEN_INTAKE` | Already configured for the inbound SMS webhook; reused |

5. Test: send a test email to `bedbug+1@<your-inbound-domain>` from
   `KARL_EMAIL`. A comment should appear on issue #1 within a few seconds.

> **Note:** Resend doesn't currently offer inbound email parsing, so the
> outbound (Resend) and inbound (Postmark) sides run on different providers.
> This is fine — `RESEND_API_KEY` and the Postmark inbound creds are
> independent.

## Required GitHub Actions secrets

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Console → Plans & Billing → enable, then API Keys → create |
| `GH_TOKEN_ANSWER` | Fine-grained PAT on this repo, **Issues: write**. Must NOT be `GITHUB_TOKEN` — answer-mom.yml filters out Bot authors, so answers need a user-type identity to fire it. |
| `RESEND_API_KEY` | For the daily summary email (same key Vercel already uses) |
| `KARL_EMAIL` | Where the daily summary lands |

## Required Vercel env vars (Phase 4)

| Variable | Purpose |
|---|---|
| `POSTMARK_INBOUND_USER` | Basic-auth user on the inbound webhook URL |
| `POSTMARK_INBOUND_PASS` | Basic-auth password |
| `POSTMARK_INBOUND_DOMAIN` | Hostname used in outbound `reply_to` (default `inbound.93.fyi`) |

## Required labels

Create both at https://github.com/karlmarx/mom-93fyi/labels:

- `needs-human` — set by the script when the model abstains or the cap is hit
- `mom-question` / `karl-question` — already required by inbound webhook

## After deploying — one-time setup

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
6. (Phase 4 only) Sign up for Postmark, configure inbound stream, set the
   `POSTMARK_INBOUND_*` Vercel env vars.

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
- Sonnet self-review: ~$0.020 each

Numbers will drift; update `PRICING` in `answer-mom.mjs` when Anthropic
changes pricing.
