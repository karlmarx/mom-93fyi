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
    body: "The Cozy City frame and mattress arrive. The frame needs assembly with the included Allen key — lay the parts out, count the screws, loose-attach everything before tightening anything (or the last holes won't line up). Build it in the corner where it will live; don't drag it across the room. Once the frame is together, put the new mattress on top and zip it into the white cover all the way closed. Same with the box spring cover. Lift one corner of the bed at a time and slide a little white plastic cup under each leg — there are six legs, and every single one needs a cup. Pull the bed at least a hand-span away from the wall. Make it up with the new sheets — nothing hangs to the floor. Sleep here tonight.",
  },
  {
    date: "Fri May 1",
    iso: "2026-05-01",
    headline: "First laundry day.",
    body: "One or two loads. Hot dryer, 45 minutes each. Then shower and put on clean clothes from a Ziploc.",
  },
  {
    date: "Sat May 2",
    iso: "2026-05-02",
    headline: "Take the trash bags to the dumpster.",
    body: "All the sealed black bags from the bedroom go out today. If a load is too heavy, ask a neighbor or apartment maintenance for a hand — don't lift anything that hurts. One or two more dryer loads if you're up to it.",
  },
  {
    date: "Sun May 3",
    iso: "2026-05-03",
    headline: "Rest.",
    body: "Look at the six little plastic cups under the bed legs in the morning. One easy load if you want — but only if you want.",
  },
  {
    date: "Mon May 4",
    iso: "2026-05-04",
    headline: "First weekly check-in.",
    body: "Look at all six cups. Look at the sheets. Look at your arms and legs for new bites. Tell Ben what you see.",
  },
  {
    date: "Weeks 2 — 4",
    headline: "One load a day, max.",
    body: "Don't try to do it all at once. Slow and steady. Check the cups every morning. Same as before: hot dryer, 45 minutes, sealed Ziploc with the date.",
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
