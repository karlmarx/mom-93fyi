"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { todayISO } from "./_lib/dates";

type Entry = {
  date: string;
  iso?: string;
  headline: string;
  body: string;
};

const TIMETABLE: Entry[] = [
  {
    date: "Tue Apr 28",
    iso: "2026-04-28",
    headline: "Today — keep going.",
    body: "You're already doing the work. Don't throw away anything important until you've talked to Ben. Sheets come tomorrow.",
  },
  {
    date: "Wed Apr 29",
    iso: "2026-04-29",
    headline: "Sheets arrive in the mail.",
    body: "Leave them sealed in the original packaging, in the living room, until Thursday.",
  },
  {
    date: "Thu Apr 30",
    iso: "2026-04-30",
    headline: "New mattress day. Set aside about an hour.",
    body: "The Cozy City metal frame and the twin mattress arrive. The frame needs assembly with the included Allen key — lay the parts out, count the screws, loose-attach everything before tightening anything (or the last holes won't line up). Build it in the corner where it will live; don't drag it across the room. No box spring is needed — the frame is the platform. Once the frame is together, put the mattress on top and slip the SafeNest waterproof protector over it like a fitted sheet. Lift one corner of the bed at a time and slide one of the little black plastic interceptor cups under each leg — there are six legs, and every single one needs a cup. Pull the bed at least a hand-span away from the wall. Make it up with the new sheets — nothing hangs to the floor. Sleep here tonight.",
  },
  {
    date: "Fri May 1",
    iso: "2026-05-01",
    headline: "First laundry day.",
    body: "One or two loads. Each load goes through the dryer first (HIGH HEAT, 45 min — kills the bugs), then the washer, then the dryer again. Then shower and put on clean clothes from a Ziploc.",
  },
  {
    date: "Sat May 2",
    iso: "2026-05-02",
    headline: "Take the trash bags to the dumpster.",
    body: "All the sealed black bags from the bedroom go out to the dumpster today. Take them one at a time if that's easier. One or two more dryer loads if you're up to it.",
  },
  {
    date: "Sun May 3",
    iso: "2026-05-03",
    headline: "Rest.",
    body: "Look at the six little black plastic cups under the bed legs in the morning. One easy load if you want — but only if you want.",
  },
  {
    date: "Mon May 4",
    iso: "2026-05-04",
    headline: "First weekly check-in.",
    body: "Look at all six black cups under the bed legs. Look at the sheets. Look at your arms and legs for new bites. Tell Ben what you see.",
  },
  {
    date: "Weeks 2 — 4",
    headline: "One load a day, max.",
    body: "Don't try to do it all at once. Slow and steady. Check the cups every morning. Same as before: dryer, then wash, then dryer again, sealed Ziploc with the date.",
  },
  {
    date: "~Mid-June",
    headline: "Six-week check.",
    body: "If nothing has shown up in the cups and you have no new bites, the plan is working. Ben will let you know what comes next.",
  },
  {
    date: "~October 2027",
    headline: "Open the sealed bins.",
    body: "Eighteen months from when the bedroom was sealed off. Anything stored in there comes out, gets a careful look, and goes back into your life.",
  },
];

const noopSubscribe = () => () => undefined;
const getToday = () => (typeof window === "undefined" ? null : todayISO());
const getServerToday = () => null;

export default function BedbugHome() {
  const today = useSyncExternalStore(noopSubscribe, getToday, getServerToday);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-ink/60 text-sm uppercase tracking-wider">Mom&apos;s plan</span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Bed bug plan
        </h1>
      </header>

      <Link
        href="/bedbug/confirm"
        className="block rounded-lg bg-bedbug-cream-deeper p-5 text-bedbug-ink hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
      >
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Step 0 — first
        </span>
        <span className="mt-1 block text-bedbug-title font-semibold leading-snug">
          Wait — are we sure these are bed bugs?
        </span>
        <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
          Photos to send Ben, the things that get mistaken for bed bugs, and what to do
          if you&apos;re not sure.
        </span>
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-bedbug-ink">What we&apos;re doing</h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          Three things kill bed bugs: heat, plastic, and time. The hot dryer kills them and
          their eggs. Sealed plastic bags hold them in until they starve. Time finishes the
          rest.
        </p>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          Over the next few weeks, you&apos;re moving to the living room with a fresh mattress,
          running clothes through the dryer one bag at a time, and letting the bedroom sit
          empty until the bugs starve out. No exterminator. No chemicals.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-bedbug-ink">The plan, day by day</h2>
        <ol className="flex flex-col gap-3">
          {TIMETABLE.map((entry, i) => {
            const isToday = today !== null && entry.iso === today;
            const isPast = today !== null && !!entry.iso && entry.iso < today;
            return (
              <li
                key={i}
                className={[
                  "rounded-lg p-5",
                  isToday
                    ? "bg-bedbug-sage text-bedbug-cream shadow-sm"
                    : isPast
                      ? "bg-bedbug-cream-deeper/60 text-bedbug-ink/60"
                      : "bg-bedbug-cream-deeper text-bedbug-ink",
                ].join(" ")}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-sm font-semibold uppercase tracking-wider ${
                      isToday ? "text-bedbug-cream/90" : "text-bedbug-ink/60"
                    }`}
                  >
                    {entry.date}
                    {isToday ? " — today" : ""}
                  </span>
                  <span className="text-bedbug-title font-semibold leading-snug">
                    {entry.headline}
                  </span>
                </div>
                <p className="mt-3 text-bedbug-body leading-relaxed">{entry.body}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-bedbug-ink">When you&apos;re actually doing it</h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          Three short reference cards. Open the one you need.
        </p>
        <ul className="flex flex-col gap-3">
          <li>
            <Link
              href="/bedbug/laundry"
              className="block rounded-lg bg-bedbug-cream-deeper p-5 text-bedbug-ink hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
            >
              <span className="block text-bedbug-title font-semibold leading-snug">
                Laundry steps
              </span>
              <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
                14 steps. One bag at a time. Dryer timer at the dryer step.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/bedbug/bedroom"
              className="block rounded-lg bg-bedbug-cream-deeper p-5 text-bedbug-ink hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
            >
              <span className="block text-bedbug-title font-semibold leading-snug">
                Going into the bedroom
              </span>
              <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
                Read this every time before you open the bedroom door.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/bedbug/items"
              className="block rounded-lg bg-bedbug-cream-deeper p-5 text-bedbug-ink hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
            >
              <span className="block text-bedbug-title font-semibold leading-snug">
                What do I do with this thing?
              </span>
              <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
                Shoes, books, electronics, things you love. The answer for each.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/bedbug/rules"
              className="block rounded-lg bg-bedbug-cream-deeper p-5 text-bedbug-ink hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
            >
              <span className="block text-bedbug-title font-semibold leading-snug">
                The 5 rules
              </span>
              <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
                The whole plan, distilled. On one screen.
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
