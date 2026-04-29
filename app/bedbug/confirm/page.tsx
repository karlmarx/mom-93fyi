import { BigButton } from "../_components/BigButton";

const PHOTOS_TO_SEND = [
  "The seams of the mattress (the piped edges).",
  "The corners of the box spring.",
  "The joints inside the bed frame.",
  "Any bites you have, up close, with good light. Put a coin or your finger next to one for size.",
  "Tomorrow morning, before getting up: look at the sheets. Any tiny dark dots? Any tiny bug? Take pictures.",
];

const NOT_BEDBUGS: ReadonlyArray<readonly [string, string]> = [
  ["Dry skin.", "Very common. Worse in winter."],
  [
    "An allergic reaction.",
    "To laundry detergent, fabric softener, a new lotion, or a medicine.",
  ],
  ["Mosquito bites.", ""],
  ["Flea bites.", "Usually around the ankles or lower legs."],
  [
    "A skin condition.",
    "A doctor can rule these out in ten minutes. Medicare covers it.",
  ],
];

export default function ConfirmPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Step 0 — first
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Wait. Are these really bed bugs?
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        Before any of the rest of this plan, let&apos;s make sure. Bites alone are not
        enough. Many other things look like bed bug bites and aren&apos;t.
      </p>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
        <h2 className="text-2xl font-semibold text-bedbug-ink">
          Send Ben these photos first
        </h2>
        <ol className="flex flex-col gap-3">
          {PHOTOS_TO_SEND.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-bedbug-sage text-bedbug-cream font-semibold"
              >
                {i + 1}
              </span>
              <span className="text-bedbug-body leading-snug text-bedbug-ink">{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-bedbug-ink">
          What sometimes looks like bed bugs but isn&apos;t
        </h2>
        <ul className="flex flex-col gap-3">
          {NOT_BEDBUGS.map(([label, detail], i) => (
            <li key={i} className="rounded-md bg-bedbug-cream-deeper p-4">
              <span className="block text-bedbug-body font-semibold text-bedbug-ink">
                {label}
              </span>
              {detail ? (
                <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
                  {detail}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4">
        <h2 className="text-2xl font-semibold text-bedbug-ink">
          If you&apos;re still not sure
        </h2>
        <ul className="flex flex-col gap-3 text-bedbug-body leading-relaxed text-bedbug-ink">
          <li>Send Ben the photos. He&apos;ll look.</li>
          <li>
            See your doctor. Medicare covers it. They can rule out other causes in ten
            minutes.
          </li>
          <li>
            Pay $75–$200 for a single inspection (not a treatment) from a real
            exterminator company. Cheaper than guessing.
          </li>
        </ul>
      </section>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        Don&apos;t spend $1,000 on an exterminator until we&apos;re sure. Don&apos;t throw
        out anything you&apos;d miss until we&apos;re sure.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
