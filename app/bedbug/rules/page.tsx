import { BigButton } from "../_components/BigButton";

const RULES = [
  "Bedroom = dirty. Living room = clean. Don't mix them up.",
  "Going into the bedroom? Special clothes + booties first.",
  "Coming out? Take them off, drop in the wall bag, shower, fresh clothes from a Ziploc.",
  "Dryer = HIGH HEAT, 45 minutes. Then straight into a Ziploc with today's date.",
  "Every morning: Check the 6 black cups under the bed legs. Tell Ben if anything's there.",
];

export default function RulesPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          The 5 rules
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          The whole plan, on one page.
        </h1>
      </header>

      <ol className="flex flex-col gap-4">
        {RULES.map((rule, i) => (
          <li key={i} className="flex items-start gap-4 rounded-md bg-bedbug-cream-deeper p-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-bedbug-sage text-bedbug-cream text-2xl font-semibold"
            >
              {i + 1}
            </span>
            <span className="text-bedbug-body leading-snug text-bedbug-ink">{rule}</span>
          </li>
        ))}
      </ol>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        If confused — STOP — sit down — call Ben. He has the plan.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
