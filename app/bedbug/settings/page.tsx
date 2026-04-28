"use client";

import { BigButton } from "../_components/BigButton";
import { useSettings } from "../_hooks/useSettings";
import { useAppState } from "../_hooks/useAppState";
import { CONFIG } from "../_lib/config";

export default function SettingsPage() {
  const { settings, patch } = useSettings();
  const { state, patch: patchState } = useAppState();

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-ink/60 text-sm font-semibold uppercase tracking-wider">
          Settings (Karl)
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Operator controls
        </h1>
      </header>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
        <Toggle
          label="Bed bugs confirmed (unlocks the full app)"
          checked={settings.confirmedBedbugs}
          onChange={(v) => {
            patch({ confirmedBedbugs: v });
            patchState({ confirmedBedbugs: v });
          }}
        />
        <Toggle
          label="Larger text mode"
          checked={settings.largeTextMode}
          onChange={(v) => patch({ largeTextMode: v })}
        />
      </section>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
        <h2 className="text-xl font-semibold text-bedbug-ink">Phones</h2>
        <p className="text-base text-bedbug-ink/70">
          Karl: <span className="font-mono">{CONFIG.KARL_PHONE}</span>
          <br />
          Helper: <span className="font-mono">{CONFIG.HELPER_PHONE || "(not set)"}</span>
        </p>
        <p className="text-sm text-bedbug-ink/60">
          Set <code>NEXT_PUBLIC_KARL_PHONE</code> and{" "}
          <code>NEXT_PUBLIC_HELPER_PHONE</code> in Vercel project env vars.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
        <h2 className="text-xl font-semibold text-bedbug-ink">State</h2>
        <p className="text-base text-bedbug-ink/70">
          Loads completed: {state.laundryRunsCompleted}
          <br />
          Mattress day done: {state.mattressDayCompleted ? "yes" : "no"}
          <br />
          Clean-zone start: {state.cleanZoneSetupDate ?? "—"}
          <br />
          Last interceptor capture: {state.lastInterceptorCaptureDate ?? "none"}
        </p>
        <BigButton
          variant="ghost"
          onClick={() => {
            if (typeof window === "undefined") return;
            if (window.confirm("Reset all stored progress for Mom's app?")) {
              window.localStorage.removeItem("bedbug.appState.v1");
              window.localStorage.removeItem("bedbug.dryerTimer.startedAt");
              window.location.reload();
            }
          }}
        >
          Reset Mom&apos;s progress
        </BigButton>
      </section>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md bg-bedbug-cream p-4">
      <span className="text-bedbug-body text-bedbug-ink">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-7 w-7 accent-bedbug-sage"
        aria-label={label}
      />
    </label>
  );
}
