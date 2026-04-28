# mom.93.fyi

Next.js 16 (App Router) site that serves both the public mom.93.fyi landing
page (at `/`) and **Mom's Bed Bug Plan** (at `/bedbug`, also reachable via
`bedbug.93.fyi`).

## Getting started

```bash
npm install
npm run dev
```

- <http://localhost:3000> — landing page
- <http://localhost:3000/bedbug> — bed bug plan

To test the `bedbug.93.fyi` subdomain locally, add to `/etc/hosts`:

```
127.0.0.1   bedbug.localhost
```

then visit <http://bedbug.localhost:3000>. The proxy treats any host that
starts with `bedbug.` as the PWA subdomain.

## Mom's Bed Bug Plan

A single-page overview Mom can read top-to-bottom and three short reference
cards she opens when she's actually doing a procedure.

The plan is the source of truth. **`docs/plan.md`** is the long-form version
that the timetable and procedure cards are distilled from.

### Pages

| Route | What it is |
|---|---|
| `/bedbug` | The whole plan: what we're doing, day-by-day timetable, procedure links |
| `/bedbug/laundry` | 14-step laundry checklist with 45-min dryer timer |
| `/bedbug/bedroom` | Entry/exit ritual reference card |
| `/bedbug/rules` | The 5 rules, on one screen |

That's it. No flows, no gates, no settings, no SMS, no photos, no progress
tracking, no daily check-in. The home page shows the plan; the procedure
pages show the steps when she's doing the thing.

### Hosting on `bedbug.93.fyi`

`proxy.ts` rewrites any host starting with `bedbug.` so that `/foo` serves
`/bedbug/foo`. One-time setup:

1. **DNS:** at `93.fyi` registrar, add CNAME `bedbug` → `cname.vercel-dns.com`
2. **Vercel:** in the `mom-93fyi` project → Settings → Domains, add `bedbug.93.fyi`
3. Visit `https://bedbug.93.fyi/` — the PWA loads at root.

`mom.93.fyi/bedbug` continues to work, unchanged.

### PWA install

- Manifest at `/manifest.webmanifest` (`start_url: /bedbug`, `scope: /bedbug/`)
- Service worker at `public/bedbug-sw.js` registered on first visit for
  offline caching of `/bedbug/*`
- iOS users: Add to Home Screen via the share sheet

### Architecture

- **Next.js 16 App Router**, React 19. The PWA is a sub-route, not a
  separate app. Same deployment, same codebase as the landing page.
- `app/bedbug/_lib`, `_hooks`, `_components` — Next.js private folders
  (underscore-prefixed → not routable).
- **No persistent state** outside the dryer timer's start time
  (`localStorage` key `bedbug.dryerTimer.startedAt`, so a 45-min timer
  survives backgrounding).
- **No backend, no auth.** Single-user device.

### Workflow

- Branch-first. Never push to `main`. Feature branch → preview → PR.
- `.gitignore` excludes `node_modules/` and `.next/`.
- Run `git diff --stat` before committing.

### Changing Mom-facing copy

The home page timetable lives in `app/bedbug/page.tsx` as a `TIMETABLE`
constant. Each entry has a date string, an optional ISO date (used to
highlight "today"), a headline, and a body. Edit there to adjust dates or
wording. The 14 laundry steps in `app/bedbug/laundry/page.tsx` and the
bedroom + rules cards mirror sections of `docs/plan.md` — keep them
roughly in sync.

## Verification before declaring done

- [ ] `.gitignore` excludes `node_modules/` and `.next/`
- [ ] `npm run lint` clean
- [ ] `npm run build` lists `/bedbug`, `/bedbug/laundry`, `/bedbug/bedroom`,
      `/bedbug/rules`, `/manifest.webmanifest`, and the `Proxy` line
- [ ] On a real phone, the home page reads top-to-bottom without confusion
- [ ] Dryer timer fires after 45 minutes (drop `DURATION_MS` for a quick
      local test, then revert)
- [ ] Service worker registers on first visit (DevTools → Application)
- [ ] `bedbug.93.fyi/` serves the home page (after DNS + Vercel domain step)
