import { BigButton } from "../_components/BigButton";

const STEPS: string[] = [
  "Lay all the pieces of the bed frame out on the floor in the corner where the bed will live. Count the screws so you know they're all there.",
  "Loose-attach all the screws first — finger-tight only. If you tighten the first one all the way, the last holes won't line up.",
  "Once every screw is started, go back with the Allen key and tighten them all the way.",
  "Put the new ZenDen mattress on the frame, centered.",
  "Slip the SafeRest waterproof cover over the mattress like a fitted sheet. Stretch the corners over each corner. It hugs the top and sides; it doesn't zip.",
  "Lift one leg of the bed and slide a little black plastic cup under it. Do this for all six legs. Take your time — sit if you need to.",
  "Pull the bed at least one hand-span away from any wall. Nothing about it should touch a wall.",
  "Make the bed with the new Casa Platino sheets. Tuck them. Nothing should hang to the floor.",
  "You're done. Shower and put on clean clothes from a Ziploc. Sleep here tonight.",
];

export default function MattressDayPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          The new bed
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          How to set it up.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        Build the metal frame first. Then put the mattress on it, slip the
        waterproof cover over the top, and put one black plastic cup under each
        of the six legs. The cups are what stop bed bugs from getting up onto
        the new bed.
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
        Six legs, six cups. The other two cups go on the bedroom floor as
        monitors — one near the door, one along a wall.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
