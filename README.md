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

A small focused PWA that walks Mom through the bed bug remediation plan one
step at a time. She lives alone, uses a walker, gets confused easily, and is
in another state from her son. The plan in `docs/plan.md` is the source of
truth for content; the app pulls step text and "DONE when" criteria from it.

### Routes

| Route | What it is |
|---|---|
| `/bedbug` | Home — priority-ordered cards (or Section 0 gate) |
| `/bedbug/confirm` | Section 0 — three photo tasks to confirm before spending |
| `/bedbug/check-in` | Daily morning 3-question flow → SMS Ben |
| `/bedbug/laundry` | 14-step laundry wizard with 45-min dryer timer |
| `/bedbug/bedroom` | Entry/exit ritual reference card |
| `/bedbug/mattress-day` | Thursday wizard (frame, mattress, protector, cups) |
| `/bedbug/rules` | The 5 rules, on one screen |
| `/bedbug/items` | "What do I do with this thing?" reference card |
| `/bedbug/progress` | Loads done, days clean, days since last capture |
| `/bedbug/stuck` | Panic screen — reassurance audio + Call Ben |
| `/bedbug/settings` | Hidden — see [Hidden settings](#hidden-settings) below |

### Section 0 gate

Until Ben confirms the bed bug diagnosis, the home screen replaces the
operational cards with a single card pointing to `/bedbug/confirm`. Ben flips
the switch in the hidden Settings page once the photos confirm it; the rest
of the app unlocks immediately.

### Hidden settings

Reachable by tapping the home-screen header **5 times within 3 seconds**.
Two switches Ben (or whoever's helping remotely) can flip without
redeploying:

- **Bed bugs confirmed** — gates the operational app behind Section 0.
- **Large text mode** — bumps body text by ~25% via a body class.

The settings page also dumps the current `localStorage` app state and offers
a reset button.

### Configuration

`app/bedbug/_lib/config.ts` is the single config. Phone numbers and the
reassurance-audio URL come from environment variables when present:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_KARL_PHONE` (or `VITE_KARL_PHONE`) | Number for the `tel:` and `sms:` links — `+1XXXXXXXXXX` format |
| `NEXT_PUBLIC_HELPER_PHONE` (or `VITE_HELPER_PHONE`) | Optional secondary contact |

Set these in Vercel → Project → Settings → Environment Variables. They are
public — they ship in the client bundle.

### Photos

The wizard step cards render `<PhotoSlot>` placeholders with stable IDs.
To replace a placeholder with a real picture: drop a JPEG at
`/public/photos/[slot-id].jpg` (no other action needed; the component
fetches `/photos/[id].jpg` and falls back to the placeholder if the file
isn't there).

Slot IDs currently in use:

- `confirm-mattress-seam`
- `confirm-bites`
- `confirm-sheets-morning`
- `mattress-frame-parts`
- `mattress-on-frame`
- `safenest-protector`
- `interceptors-placed`

### Reassurance audio

The `/bedbug/stuck` panic screen plays a recording of Ben's voice. To enable
it, drop an MP3 at `/public/audio/karl-reassurance.mp3`. Until that file
exists, the play button shows "Audio message — coming soon" and is disabled.

### Hosting on `bedbug.93.fyi`

`proxy.ts` (Next.js 16 — what used to be `middleware.ts`) rewrites any host
starting with `bedbug.` so that `/foo` serves `/bedbug/foo`. One-time setup:

1. **DNS:** at `93.fyi` registrar, add CNAME `bedbug` → `cname.vercel-dns.com`
2. **Vercel:** in the `mom-93fyi` project → Settings → Domains, add `bedbug.93.fyi`
3. Visit `https://bedbug.93.fyi/` — the PWA loads at root.

`mom.93.fyi/bedbug` continues to work, unchanged.

### PWA install

- Manifest at `/manifest.webmanifest` (`start_url: /bedbug`, `scope: /bedbug/`)
- Service worker at `public/bedbug-sw.js` registered on first visit for
  offline caching of `/bedbug/*`. Bump the `CACHE` constant on a content
  release to invalidate.
- iOS users: Add to Home Screen via the share sheet.

### Architecture

- **Next.js 16 App Router**, React 19. The PWA is a sub-route, not a
  separate app. Same deployment, same codebase as the landing page.
- `app/bedbug/_lib`, `_hooks`, `_components` — Next.js private folders
  (underscore-prefixed → not routable).
- **State:** `localStorage` only. Two keys:
  - `bedbug.settings` — `{ confirmedBedbugs, largeTextMode }`
  - `bedbug.appState` — `{ laundryRunsCompleted, mattressDayCompleted, ... }`
  - Plus `bedbug.dryerTimer.startedAt` so a 45-minute dryer timer survives
    a backgrounded app.
- **No backend, no auth.** Single-user device.

### Workflow

- Branch-first. Never push to `main`. Feature branch → preview → PR.
- `.gitignore` excludes `node_modules/` and `.next/`. Verify before every
  first commit on a fresh clone.
- Run `git diff --stat` before committing.

### Changing Mom-facing copy

`docs/plan.md` is the source of truth. The 14 laundry steps in
`app/bedbug/laundry/page.tsx`, the entry/exit ritual in
`app/bedbug/bedroom/page.tsx`, the rules in `app/bedbug/rules/page.tsx`,
and the mattress-day steps in `app/bedbug/mattress-day/page.tsx` mirror
sections of the plan. If the app and the plan disagree, edit both.

## Verification before declaring done

- [ ] `.gitignore` excludes `node_modules/` and `.next/`
- [ ] `git diff --stat` reviewed before each commit
- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds and lists every route above plus
      `/manifest.webmanifest` and a `Proxy` line
- [ ] Vercel preview URL works on real mobile (iPhone Safari + Android)
- [ ] `tel:` link opens dialer with Ben's number
- [ ] `sms:` "all clear" link opens Messages with prefilled text
- [ ] Dryer timer alarm fires after 45 minutes (temporarily set
      `DURATION_MS = 45 * 1000` in `DryerTimer.tsx` for a 45-second test,
      then revert)
- [ ] Service worker registers (DevTools → Application). App loads with
      airplane mode on after first visit.
- [ ] Section 0 gate works: `confirmedBedbugs = false` shows only the
      photo-task card; `= true` reveals the rest. Toggle via the hidden
      Settings page (5 taps on the home header within 3 seconds).
- [ ] All 14 laundry steps render verbatim from `docs/plan.md`
- [ ] VoiceOver reads the laundry-wizard flow without confusion
- [ ] Tap targets large enough on a 5.5" device
