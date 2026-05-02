import { BigButton } from "../_components/BigButton";

const STEPS: string[] = [
  "Get TWO new black trash bags.",
  "Put on bedroom outfit + booties (door card).",
  "Open bedroom door, go in, close it.",
  "Pick up about a grocery-bag's worth of clothes. Don't fill the trash bag full.",
  "Put clothes in the FIRST black bag. Tie top tight.",
  "Put that bag inside the SECOND black bag. Tie that one too.",
  "Take off bedroom outfit → wall bag. Booties → wall bag.",
  "Open door. Go out. Close it.",
  "Walk straight to dryer. Don't put the bag on furniture along the way.",
  "Open dryer. Open bag at the dryer mouth. Tip clothes in. Don't reach in.",
  "Set dryer: HIGH HEAT, 45 MIN. Press START. (This first dry is what kills the bed bugs.)",
  "Take both empty bags straight to the outside trash NOW.",
  "When dryer beeps: move the clothes from the dryer into the washer. Wash on hot.",
  "When the washer is done: move the clothes back to the dryer. Set: HIGH HEAT, 45 MIN. Press START.",
  "When dryer beeps: get a clear Ziploc. Tip the hot clothes from dryer into Ziploc. Zip closed. Write today's date on it.",
  "Carry Ziploc to the living room. Put on the “CLEAN” pile.",
];

export default function LaundryPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          One load of laundry
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Dryer first. Then wash. Then dryer again.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        One bag at a time. The first 45 minutes in the dryer on HIGH is what
        kills the bed bugs — that&apos;s why the dryer comes before the wash.
      </p>

      <ol className="flex flex-col gap-3">
        {STEPS.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-4 rounded-md bg-bedbug-cream-deeper p-4"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-bedbug-sage text-bedbug-cream font-semibold"
            >
              {i + 1}
            </span>
            <span className="text-bedbug-body leading-snug text-bedbug-ink">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        Then shower and put on clean clothes from a Ziploc.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
