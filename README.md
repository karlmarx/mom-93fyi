# mom.93.fyi

Next.js 16 (App Router) site that serves both the public mom.93.fyi landing page
(at `/`) and **Mom's Bed Bug Plan** PWA (at `/bedbug`).

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000> for the landing page,
<http://localhost:3000/bedbug> for the PWA.

## Mom's Bed Bug Plan PWA

A step-by-step interactive checklist Mom executes from her phone while Karl
operates remotely from another state.

The plan is the source of truth. Read **`docs/plan.md`** before changing any
Mom-facing copy — step text and "DONE when" criteria come verbatim from there.

### Routes

All PWA routes live under `/bedbug/*`.

| Route | Purpose |
|---|---|
| `/bedbug` | Home — big tappable cards |
| `/bedbug/confirm` | Section 0 photo-task flow (gates the rest) |
| `/bedbug/check-in` | Daily 3-question morning routine |
| `/bedbug/laundry` | 14-step laundry wizard with 45-min dryer timer |
| `/bedbug/bedroom` | Entry/exit ritual reference card |
| `/bedbug/mattress-day` | Thursday flow (encasement, interceptors, sheets) |
| `/bedbug/rules` | The 5 rules, on one page |
| `/bedbug/progress` | Loads done, days clean, days quiet |
| `/bedbug/stuck` | Panic screen — call Karl + reassurance audio |
| `/bedbug/settings` | Hidden Karl-only controls (5 taps on the title within 3 seconds) |

### Configuration (Vercel env vars)

Set these in Vercel → Project Settings → Environment Variables:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_KARL_PHONE` | yes | E.164 format, e.g. `+15551234567`. Used for `tel:` and `sms:` links. |
| `NEXT_PUBLIC_HELPER_PHONE` | optional | Helper's number (not currently surfaced in the UI). |

The mattress delivery date and plan start date are hard-coded in
`app/bedbug/_lib/config.ts`.

### Section 0 gate (Karl unlocks the app)

When Karl is ready to declare bed bugs confirmed:

1. Open <https://mom.93.fyi/bedbug> on Mom's phone or any browser with the
   same `localStorage` (won't sync across devices).
2. Tap the "Bed bug plan" title **5 times within 3 seconds**.
3. The Settings page opens.
4. Toggle **"Bed bugs confirmed (unlocks the full app)"** on.
5. Tap "Back to home." All operational cards now appear.

To re-lock, toggle it off in the same place.

### Adding photos

The PWA expects "what done looks like" photos at `/photos/<slot-id>.jpg`.
Until Karl uploads them, each spot renders a gray placeholder labelled with the
slot ID. Slot IDs visible in the app:

- `confirm-mattress`, `confirm-bites`, `confirm-sheets`
- `laundry-01-bags` … `laundry-14-clean`
- `mattress-01-helper` … `mattress-08-done`

Drop a JPG named `<slot-id>.jpg` into `public/photos/` and commit.

### Reassurance audio

The `/bedbug/stuck` panic screen plays an audio file at
`/audio/karl-reassurance.mp3` (configured in `app/bedbug/_lib/config.ts`).
Until Karl uploads one, the button shows "Coming soon" disabled. Drop an `.mp3`
into `public/audio/karl-reassurance.mp3` to enable.

### PWA install

- Manifest is at `/manifest.webmanifest` with `start_url: /bedbug` and
  `scope: /bedbug/`. iOS users add to home screen via the share sheet.
- Service worker at `public/bedbug-sw.js` caches `/bedbug/*` for offline use
  and is registered on first visit (scope `/bedbug/`).

### Architecture notes

- **Sub-route layout, not separate app**: the PWA lives under `/bedbug/*` so it
  ships as part of the existing `mom.93.fyi` deployment. The original prompt
  asked for a Vite app at `mom-bedbug-plan.vercel.app`; we opted to host inside
  the existing repo to avoid a second deployment and DNS record. If/when a
  separate domain is preferred, the entire `app/bedbug/` tree is portable.
- **Private folders**: utilities, hooks, and components live in
  `app/bedbug/_lib`, `_hooks`, `_components` (Next.js convention — folders
  prefixed with `_` are not routable).
- **State**: a single `localStorage` blob (`bedbug.appState.v1`) holds laundry
  count, mattress-day flags, and check-in history. Settings live in a separate
  blob (`bedbug.settings.v1`). No backend, no auth.

### Workflow

- Branch-first. Never push to `main`. Feature branch → preview → PR.
- `.gitignore` excludes `node_modules/` and `.next/` — verify before any push.
- Run `git diff --stat` before committing.

### Deployment

`vercel.json` is preconfigured for `framework: nextjs`. Push to a feature
branch and Vercel will produce a preview URL of the form
`mom-93fyi-git-<branch>-karlmarxs-projects.vercel.app`.

## Verification checklist before declaring a release

- [ ] `.gitignore` excludes `node_modules/` and `.next/` — run `git status`
- [ ] `npm run lint` is clean
- [ ] `npm run build` succeeds and lists `/bedbug/*` routes
- [ ] Vercel preview URL works on iPhone Safari + Android Chrome
- [ ] `tel:` link opens the dialer with Karl's number
- [ ] `sms:` link opens Messages with prefilled "Mom: all clear today."
- [ ] Dryer timer alarm fires after 45 minutes (drop `DURATION_MS` to a few
      seconds in `DryerTimer.tsx` for a quick local test, then revert)
- [ ] Service worker registers on first visit (`Application` panel in DevTools)
- [ ] Section 0 gate works: with `confirmedBedbugs=false` only the photo-task
      card shows; toggle on and the full home appears
- [ ] All 14 laundry steps render verbatim from `docs/plan.md` Section 4.2
- [ ] VoiceOver reads through a full laundry-wizard flow without confusion
