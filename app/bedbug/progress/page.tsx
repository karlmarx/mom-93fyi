"use client";

import { BigButton } from "../_components/BigButton";
import { useAppState } from "../_hooks/useAppState";
import { daysBetween, todayISO } from "../_lib/dates";

export default function ProgressPage() {
  const { state } = useAppState();
  const today = todayISO();
  const daysInCleanZone = daysBetween(state.cleanZoneSetupDate, today);
  const daysSinceLastCapture = state.lastInterceptorCaptureDate
    ? daysBetween(state.lastInterceptorCaptureDate, today)
    : daysInCleanZone;

  const stats: { label: string; value: string }[] = [
    {
      label: "Loads of laundry done",
      value: String(state.laundryRunsCompleted),
    },
    {
      label: "Days in the living room",
      value: state.cleanZoneSetupDate ? `${daysInCleanZone}` : "Not started",
    },
    {
      label: "Days since anything in a cup",
      value: state.cleanZoneSetupDate ? `${daysSinceLastCapture}` : "—",
    },
    {
      label: "Last check-in",
      value: state.lastCheckInDate
        ? `${state.lastCheckInDate} (${state.lastCheckInResult === "all_clear" ? "all clear" : "flagged for Karl"})`
        : "None yet",
    },
  ];

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          My progress
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Look at how far you&apos;ve come.
        </h1>
      </header>

      <dl className="flex flex-col gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col rounded-md bg-bedbug-cream-deeper p-4"
          >
            <dt className="text-base text-bedbug-ink/70">{s.label}</dt>
            <dd className="mt-1 text-bedbug-title font-semibold leading-tight text-bedbug-ink">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
