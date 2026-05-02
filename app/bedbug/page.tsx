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
            href="/bedbug/bedroom"
            title="Going into the bedroom?"
            body="Read this every time before you open the bedroom door."
          />
        </li>
        <li>
          <HomeCard
            href="/bedbug/laundry"
            title="How to do a load of laundry"
            body="Step by step. Dryer first, then wash, then dryer again."
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
        <li>
          <HomeCard
            href="/bedbug/questions"
            title="Things you've asked"
            body="Your questions, answered. Search any word — freezer, dog, suitcase — to jump to it."
          />
        </li>
      </ul>
    </div>
  );
}
