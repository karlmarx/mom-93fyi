"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { HomeCard } from "./_components/HomeCard";

const TAP_WINDOW_MS = 3000;
const TAP_TARGET = 5;

export default function BedbugHome() {
  const router = useRouter();
  const tapsRef = useRef<number[]>([]);

  function handleLogoTap() {
    const now = Date.now();
    const recent = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS);
    recent.push(now);
    tapsRef.current = recent;
    if (recent.length >= TAP_TARGET) {
      tapsRef.current = [];
      router.push("/bedbug/settings");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header
        className="flex select-none flex-col gap-2"
        onClick={handleLogoTap}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLogoTap();
        }}
        tabIndex={0}
        role="button"
        aria-label="Mom's bed bug plan"
      >
        <span className="text-bedbug-ink/60 text-sm uppercase tracking-wider">
          Mom&apos;s plan
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Bed bug plan
        </h1>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
          Read whichever page you need.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bedbug-ink/60">
          Every morning
        </h2>
        <ul className="flex flex-col gap-4">
          <li>
            <HomeCard
              href="/bedbug/morning"
              title="The morning check"
              body="Three short looks — cups, sheets, skin. About a minute. Then your day starts."
              variant="primary"
            />
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bedbug-ink/60">
          When you&apos;re doing something
        </h2>
        <ul className="flex flex-col gap-4">
          <li>
            <HomeCard
              href="/bedbug/laundry"
              title="How to do a load of laundry"
              body="Step by step. Dryer first, then wash, then dryer again."
            />
          </li>
          <li>
            <HomeCard
              href="/bedbug/bedroom"
              title="Going into the bedroom?"
              body="Read this every time before you open the bedroom door."
            />
          </li>
          <li>
            <HomeCard
              href="/bedbug/mattress-day"
              title="🛏️ The new bed"
              body="How the frame, mattress, cover, and 6 black cups go together."
            />
          </li>
          <li>
            <HomeCard
              href="/bedbug/items"
              title="What do I do with this thing?"
              body="Shoes, books, electronics, suitcases. The answer for each."
            />
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bedbug-ink/60">
          If something feels off
        </h2>
        <ul className="flex flex-col gap-4">
          <li>
            <HomeCard
              href="/bedbug/worried"
              title="When something feels wrong"
              body="Saw a bug? Forgot a step? Can't sleep? Read this first."
            />
          </li>
          <li>
            <HomeCard
              href="/bedbug/bites"
              title="Bites and skin"
              body="What bed bug bites look like, and what gets confused with them."
            />
          </li>
          <li>
            <HomeCard
              href="/bedbug/questions"
              title="Things you've asked"
              body="Your questions, answered. Jump to any topic from the table at the top."
            />
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bedbug-ink/60">
          The plan, on one screen
        </h2>
        <ul className="flex flex-col gap-4">
          <li>
            <HomeCard
              href="/bedbug/rules"
              title="The 5 rules"
              body="The whole plan, on one page."
            />
          </li>
          <li>
            <HomeCard
              href="/bedbug/timetable"
              title="The timetable"
              body="Where we are this week, and what's coming."
            />
          </li>
          <li>
            <HomeCard
              href="/bedbug/why"
              title="Why this works"
              body="Heat. Plastic. Time. The plain-language reason behind every step."
            />
          </li>
        </ul>
      </section>
    </div>
  );
}
