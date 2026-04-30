"use client";

import { useRouter } from "next/navigation";
import { useRef, useSyncExternalStore } from "react";
import { CONFIG } from "./_lib/config";
import { todayISO } from "./_lib/dates";
import { useAppState } from "./_hooks/useAppState";
import { useSettings } from "./_hooks/useSettings";
import { HomeCard } from "./_components/HomeCard";

const noopSubscribe = () => () => undefined;
const getToday = () => (typeof window === "undefined" ? null : todayISO());
const getServerToday = () => null;

// 5 taps within 3 seconds on the title unlocks the hidden Settings page.
const TAP_WINDOW_MS = 3000;
const TAP_TARGET = 5;

export default function BedbugHome() {
  const today = useSyncExternalStore(noopSubscribe, getToday, getServerToday);
  const [settings] = useSettings();
  const [state] = useAppState();
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

  const showMattressCard =
    today === CONFIG.MATTRESS_DELIVERY_DATE && !state.mattressDayCompleted;

  return (
    <div className="flex flex-col gap-8">
      <header
        className="flex select-none flex-col gap-2"
        onClick={handleLogoTap}
        // Keyboard equivalent: 5 Enters in 3 seconds also opens settings.
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
      </header>

      {!settings.confirmedBedbugs ? (
        <Section0Gate />
      ) : (
        <OperationalCards showMattressCard={showMattressCard} />
      )}
    </div>
  );
}

function Section0Gate() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        Waiting on Ben to confirm what&apos;s happening. Tap below for
        today&apos;s photo tasks. Don&apos;t throw anything away today.
      </p>
      <HomeCard
        href="/bedbug/confirm"
        eyebrow="First — before anything else"
        title="Today's photo tasks"
        body="Three quick photos to send Ben. He'll look and tell you what's next."
        variant="primary"
      />
    </div>
  );
}

function OperationalCards({ showMattressCard }: { showMattressCard: boolean }) {
  return (
    <ul className="flex flex-col gap-4">
      <li>
        <HomeCard
          href="/bedbug/check-in"
          eyebrow="Today"
          title="Today's check-in"
          body="Three quick things to look at. Then text Ben."
          variant="primary"
        />
      </li>
      <li>
        <HomeCard
          href="/bedbug/laundry"
          title="Run a load of laundry"
          body="14 steps. One bag at a time. Dryer timer included."
        />
      </li>
      <li>
        <HomeCard
          href="/bedbug/bedroom"
          title="Going into the bedroom?"
          body="Read this every time before you open the bedroom door."
        />
      </li>
      {showMattressCard ? (
        <li>
          <HomeCard
            href="/bedbug/mattress-day"
            eyebrow="Today only"
            title="🛏️ New mattress day"
            body="Build the frame, set up the new bed, place the cups, make the bed."
            variant="primary"
          />
        </li>
      ) : null}
      <li>
        <HomeCard
          href="/bedbug/progress"
          title="My progress"
          body="Loads done. Days clean. How it's going."
        />
      </li>
      <li>
        <HomeCard
          href="/bedbug/items"
          title="What do I do with this thing?"
          body="Shoes, books, electronics, things you love. The answer for each."
        />
      </li>
      <li>
        <HomeCard
          href="/bedbug/rules"
          title="The 5 rules"
          body="The whole plan, on one page."
        />
      </li>
      <li>
        <HomeCard
          href="/bedbug/stuck"
          title="🆘 I'm stuck — call Ben"
          body="A breath, a kind word, and Ben's number."
          variant="danger"
        />
      </li>
    </ul>
  );
}
