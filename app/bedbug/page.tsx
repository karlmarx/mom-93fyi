"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { HomeCard } from "./_components/HomeCard";
import { useSettings } from "./_hooks/useSettings";
import { useAppState } from "./_hooks/useAppState";
import { CONFIG } from "./_lib/config";
import { todayISO } from "./_lib/dates";

export default function BedbugHome() {
  const { settings } = useSettings();
  const { state } = useAppState();
  const router = useRouter();

  // 5-tap-on-logo gate to /settings
  const tapsRef = useRef<number[]>([]);
  function onLogoTap() {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current.filter((t) => now - t < 3000), now];
    if (tapsRef.current.length >= 5) {
      tapsRef.current = [];
      router.push("/bedbug/settings");
    }
  }

  if (!settings.confirmedBedbugs) {
    return <PreConfirmHome onLogoTap={onLogoTap} />;
  }

  const today = todayISO();
  const showMattressDay =
    today === CONFIG.MATTRESS_DELIVERY_DATE && !state.mattressDayCompleted;

  return (
    <div className="flex flex-col gap-6">
      <Header onLogoTap={onLogoTap} />

      <div className="flex flex-col gap-4">
        <HomeCard
          href="/bedbug/check-in"
          title="Today's check-in"
          subtitle="Three quick questions, then text Karl."
          variant="primary"
        />
        <HomeCard
          href="/bedbug/laundry"
          title="Run a load of laundry"
          subtitle="One bag at a time. Hot dryer, 45 minutes."
          icon="🧺"
        />
        <HomeCard
          href="/bedbug/bedroom"
          title="Going into the bedroom?"
          subtitle="Read the rules first. Every time."
          icon="🚪"
        />

        {showMattressDay ? (
          <HomeCard
            href="/bedbug/mattress-day"
            title="New mattress day"
            subtitle="Helper is coming. Step-by-step here."
            icon="🛏️"
            variant="primary"
          />
        ) : null}

        <HomeCard
          href="/bedbug/progress"
          title="My progress"
          subtitle="How many loads, days clean, days quiet."
        />
        <HomeCard
          href="/bedbug/rules"
          title="The 5 rules"
          subtitle="The short list, on one screen."
        />
        <HomeCard
          href="/bedbug/stuck"
          title="I'm stuck — call Karl"
          subtitle="Tap here when nothing makes sense."
          variant="danger"
        />
      </div>
    </div>
  );
}

function Header({ onLogoTap }: { onLogoTap: () => void }) {
  return (
    <button
      type="button"
      onClick={onLogoTap}
      aria-label="Bed bug plan"
      className="-mx-4 flex flex-col items-start gap-1 px-4 pb-2 pt-2 text-left focus:outline-none"
    >
      <span className="text-bedbug-ink/60 text-sm uppercase tracking-wider">Mom&apos;s plan</span>
      <span className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
        Bed bug plan
      </span>
    </button>
  );
}

function PreConfirmHome({ onLogoTap }: { onLogoTap: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Header onLogoTap={onLogoTap} />

      <ConfirmCard />

      <p className="text-bedbug-body text-bedbug-ink/70">
        Karl will look at your photos and tell you what&apos;s next. You can rest. Don&apos;t throw
        anything away today.
      </p>
    </div>
  );
}

function ConfirmCard() {
  // Default-priority card: take photos, send to Karl, wait
  return (
    <a
      href="/bedbug/confirm"
      className="flex w-full flex-col gap-2 rounded-xl bg-bedbug-sage px-6 py-6 text-left text-bedbug-cream shadow-sm focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
      style={{ minHeight: 96 }}
    >
      <span className="text-bedbug-title font-semibold leading-tight">
        Today&apos;s photo tasks
      </span>
      <span className="text-base opacity-90">
        Send Karl a few pictures. Then rest.
      </span>
    </a>
  );
}

