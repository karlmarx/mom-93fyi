"use client";

import { BigButton } from "../_components/BigButton";
import { useSettings } from "../_hooks/useSettings";
import { useAppState } from "../_hooks/useAppState";

// Hidden settings page — reachable only by tapping the home-screen header
// 5 times in 3 seconds. Single source of truth for the two flags Karl can
// flip without redeploying.
export default function SettingsPage() {
  const [settings, updateSettings] = useSettings();
  const [state, updateState] = useAppState();

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Hidden settings
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          For Ben (or whoever&apos;s helping).
        </h1>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
          Mom doesn&apos;t need to see this. The two switches below change what
          the app shows her on the home screen.
        </p>
      </header>

      <Toggle
        label="Bed bugs confirmed"
        helperOn="On — full operational app is shown."
        helperOff="Off — home screen only shows the Section 0 photo-task card."
        value={settings.confirmedBedbugs}
        onChange={(v) => updateSettings({ confirmedBedbugs: v })}
      />

      <Toggle
        label="Large text mode"
        helperOn="On — body text is 25% bigger."
        helperOff="Off — default text size."
        value={settings.largeTextMode}
        onChange={(v) => updateSettings({ largeTextMode: v })}
      />

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
        <h2 className="text-2xl font-semibold text-bedbug-ink">App state</h2>
        <pre className="overflow-x-auto text-sm leading-snug text-bedbug-ink/80">
          {JSON.stringify(state, null, 2)}
        </pre>
        <BigButton
          variant="danger"
          onClick={() => {
            if (
              confirm(
                "Reset all app state (loads done, mattress day, check-ins)? This cannot be undone.",
              )
            ) {
              updateState({
                lastCheckInDate: null,
                lastCheckInResult: null,
                laundryRunsCompleted: 0,
                mattressDayCompleted: false,
                encasementOn: false,
                interceptorsPlaced: false,
                cleanZoneSetupDate: null,
                lastInterceptorCaptureDate: null,
              });
            }
          }}
        >
          Reset app state
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
  helperOn,
  helperOff,
  value,
  onChange,
}: {
  label: string;
  helperOn: string;
  helperOff: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
      <label className="flex items-center justify-between gap-4">
        <span className="text-bedbug-body font-semibold text-bedbug-ink">
          {label}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={`relative h-10 w-20 flex-none rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40 ${
            value ? "bg-bedbug-sage" : "bg-bedbug-ink/30"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute top-1 h-8 w-8 rounded-full bg-bedbug-cream shadow transition-transform ${
              value ? "translate-x-11" : "translate-x-1"
            }`}
          />
        </button>
      </label>
      <p className="text-bedbug-body text-bedbug-ink/70">
        {value ? helperOn : helperOff}
      </p>
    </div>
  );
}
