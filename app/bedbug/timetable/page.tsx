"use client";

import { useSyncExternalStore } from "react";
import { BigButton } from "../_components/BigButton";

type Entry = {
  date: string;
  iso?: string;
  range?: { startISO: string; endISO?: string };
  headline: string;
  body: string;
};

const TIMETABLE: Entry[] = [
  {
    date: "Tue Apr 28",
    iso: "2026-04-28",
    headline: "Day 1 — investigation, no big decisions yet.",
    body: "First day. Photos of the mattress, the bites, the sheets. Don't trash anything irreversible. Wait for Ben to look at the pictures.",
  },
  {
    date: "Wed Apr 29",
    iso: "2026-04-29",
    headline: "New sheets arrive in the mail.",
    body: "Leave the sheets sealed in the original packaging, in the living room. They go on the new bed tomorrow.",
  },
  {
    date: "Thu Apr 30",
    iso: "2026-04-30",
    headline: "New mattress day.",
    body: "Cozy City metal frame and the twin mattress arrive. About an hour to assemble. Mattress on, waterproof cover slipped over, six little black cups under the six legs. New sheets. Sleep in the living room from tonight on.",
  },
  {
    date: "Fri May 1",
    iso: "2026-05-01",
    headline: "First laundry day.",
    body: "One or two dryer loads. Dryer first (45 minutes HIGH), then wash, then dryer again. Then shower and into clean clothes from a Ziploc.",
  },
  {
    date: "Sat May 2",
    iso: "2026-05-02",
    headline: "Trash to the dumpster.",
    body: "All the sealed black bags from the bedroom go out today. One at a time if that's easier. One or two more dryer loads if you're up to it.",
  },
  {
    date: "Sun May 3",
    iso: "2026-05-03",
    headline: "Rest.",
    body: "Look at the cups in the morning. One easy load if you want — only if you want.",
  },
  {
    date: "Mon May 4",
    iso: "2026-05-04",
    headline: "First weekly check-in with Ben.",
    body: "Look at all six cups, look at the sheets, look at your skin. Tell Ben what you see.",
  },
  {
    date: "Weeks 2 — 6",
    range: { startISO: "2026-05-05", endISO: "2026-06-09" },
    headline: "One load a day, max.",
    body: "The active phase. Don't try to do everything at once. Slow and steady. Morning check every day. Same laundry routine: dryer first, wash, dryer again, sealed Ziploc with the date. Some days will be zero loads — that's still the plan.",
  },
  {
    date: "~Mon Jun 8",
    iso: "2026-06-08",
    headline: "Six-week check.",
    body: "If the cups have stayed empty and there are no new bites, the plan is working — high confidence. Ben will let you know what comes next. If something has shown up, that is also useful information, and we adjust from there.",
  },
  {
    date: "Through summer",
    range: { startISO: "2026-06-09", endISO: "2026-08-31" },
    headline: "Slow down.",
    body: "Past the six-week mark, the bedroom door stays closed and the cups stay where they are. You can ease off the daily morning check to a few times a week. You're not doing much except waiting.",
  },
  {
    date: "~Oct 2027",
    iso: "2027-10-01",
    headline: "Open the sealed bins.",
    body: "Eighteen months from when the bedroom was sealed off. Anything stored in there comes out, gets a careful look, and goes back into your life. The bedroom is yours again whenever you want it.",
  },
];

const noopSubscribe = () => () => undefined;
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const getToday = () => (typeof window === "undefined" ? null : todayISO());
const getServerToday = () => null;

function isToday(entry: Entry, today: string | null) {
  if (!today) return false;
  if (entry.iso) return entry.iso === today;
  if (entry.range) {
    const { startISO, endISO } = entry.range;
    const after = today >= startISO;
    const before = !endISO || today <= endISO;
    return after && before;
  }
  return false;
}

function isPast(entry: Entry, today: string | null) {
  if (!today) return false;
  if (entry.iso) return entry.iso < today;
  if (entry.range?.endISO) return entry.range.endISO < today;
  return false;
}

export default function TimetablePage() {
  const today = useSyncExternalStore(noopSubscribe, getToday, getServerToday);

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          The timetable
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Where we are, and what&apos;s coming.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        The plan unfolds slowly. Most of it is waiting and watching. Today is
        highlighted in green; the gray days are already behind you.
      </p>

      <ol className="flex flex-col gap-3">
        {TIMETABLE.map((entry, i) => {
          const here = isToday(entry, today);
          const past = isPast(entry, today);
          return (
            <li
              key={i}
              className={[
                "rounded-lg p-5",
                here
                  ? "bg-bedbug-sage text-bedbug-cream shadow-sm"
                  : past
                    ? "bg-bedbug-cream-deeper/60 text-bedbug-ink/60"
                    : "bg-bedbug-cream-deeper text-bedbug-ink",
              ].join(" ")}
            >
              <div className="flex flex-col gap-1">
                <span
                  className={`text-sm font-semibold uppercase tracking-wider ${
                    here ? "text-bedbug-cream/90" : "text-bedbug-ink/60"
                  }`}
                >
                  {entry.date}
                  {here ? " — today" : ""}
                </span>
                <span className="text-bedbug-title font-semibold leading-snug">
                  {entry.headline}
                </span>
              </div>
              <p className="mt-3 text-bedbug-body leading-relaxed">
                {entry.body}
              </p>
            </li>
          );
        })}
      </ol>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic leading-relaxed text-bedbug-ink">
        Some days will look exactly like the day before. That is normal. The
        sameness is the plan working — heat, plastic, time, doing their job
        without needing your attention.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
