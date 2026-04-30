"use client";

import { useSyncExternalStore } from "react";
import { BigButton } from "../_components/BigButton";
import { useAppState, computeStats } from "../_hooks/useAppState";
import { todayISO } from "../_lib/dates";

const noopSubscribe = () => () => undefined;
const getToday = () => (typeof window === "undefined" ? null : todayISO());
const getServerToday = () => null;

export default function ProgressPage() {
  const [state] = useAppState();
  const today = useSyncExternalStore(noopSubscribe, getToday, getServerToday);
  const stats = computeStats(state, today ?? "1970-01-01");

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Your progress
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          How it&apos;s going.
        </h1>
      </header>

      <ul className="flex flex-col gap-4">
        <Stat
          label="Loads through the dryer"
          value={stats.loadsDone}
          unit={stats.loadsDone === 1 ? "load" : "loads"}
        />
        <Stat
          label="Days in the new clean bedroom"
          value={stats.daysInCleanZone}
          unit={stats.daysInCleanZone === 1 ? "day" : "days"}
        />
        <Stat
          label="Days since anything showed up in a cup"
          value={stats.daysSinceLastCapture}
          unit={stats.daysSinceLastCapture === 1 ? "day" : "days"}
          note={
            stats.hasCaptures
              ? "Ben already knows. Keep checking."
              : state.cleanZoneSetupDate
                ? "Nothing has shown up. That's the news we want."
                : "Counting starts on mattress day."
          }
        />
      </ul>

      {state.lastCheckInDate ? (
        <p className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink/80">
          Last check-in: {state.lastCheckInDate}
          {state.lastCheckInResult === "all_clear"
            ? " — all clear."
            : state.lastCheckInResult === "flagged"
              ? " — you flagged something. Ben knows."
              : ""}
        </p>
      ) : null}

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}

function Stat({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: number;
  unit: string;
  note?: string;
}) {
  return (
    <li className="rounded-md bg-bedbug-cream-deeper p-4">
      <span className="block text-bedbug-body text-bedbug-ink/70">{label}</span>
      <span className="mt-1 block text-bedbug-title font-semibold text-bedbug-ink">
        {value} {unit}
      </span>
      {note ? (
        <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
          {note}
        </span>
      ) : null}
    </li>
  );
}
