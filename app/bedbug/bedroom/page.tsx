import { BigButton } from "../_components/BigButton";

// Verbatim from docs/plan.md Section 3.3.
const ENTER_STEPS = [
  "Put on the “bedroom outfit” from the door hook.",
  "Put booties (or grocery bags) over your shoes.",
  "Open door, go in, close it.",
  "Get only what you came for. Put it in a black bag. Tie tight.",
  "Take off bedroom outfit. Drop in the wall bag.",
  "Take off booties. Drop in the wall bag.",
  "Open door wearing your robe. Close door.",
];

export default function BedroomRules() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Going into the bedroom
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Read this every time.
        </h1>
      </header>

      <ol className="flex flex-col gap-4">
        {ENTER_STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-4 rounded-md bg-bedbug-cream-deeper p-4">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-bedbug-sage text-bedbug-cream font-semibold"
            >
              {i + 1}
            </span>
            <span className="text-bedbug-body leading-snug text-bedbug-ink">{step}</span>
          </li>
        ))}
      </ol>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        Coming out: shower, then clean clothes from a Ziploc.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
