"use client";

import { BigButton } from "../_components/BigButton";
import { useLargeText } from "../_hooks/useLargeText";

export default function SettingsPage() {
  const [largeText, setLargeText] = useLargeText();

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Hidden settings
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          For Ben.
        </h1>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
          Reach this by tapping the &ldquo;Bed bug plan&rdquo; title 5 times in
          a row.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
        <label className="flex items-center justify-between gap-4">
          <span className="text-bedbug-body font-semibold text-bedbug-ink">
            Large text mode
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={largeText}
            onClick={() => setLargeText(!largeText)}
            className={`relative h-10 w-20 flex-none rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40 ${
              largeText ? "bg-bedbug-sage" : "bg-bedbug-ink/30"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute top-1 h-8 w-8 rounded-full bg-bedbug-cream shadow transition-transform ${
                largeText ? "translate-x-11" : "translate-x-1"
              }`}
            />
          </button>
        </label>
        <p className="text-bedbug-body text-bedbug-ink/70">
          {largeText
            ? "On — body text is bigger."
            : "Off — default text size."}
        </p>
      </div>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
