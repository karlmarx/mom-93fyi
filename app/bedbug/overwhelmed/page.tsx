import { BigButton } from "../_components/BigButton";

const RIGHT_NOW = [
  "Sit on the recliner.",
  "Drink some water.",
  "Watch something on TV, or call a friend, or just close your eyes.",
  "The bedroom can wait. So can everything else.",
];

export default function OverwhelmedPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Take a break
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          It&apos;s okay. Sit down for a minute.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        This is a lot. You&apos;re handling it. Nothing has to happen in the next hour, or
        even today. The plan still works tomorrow. The plan still works next week.
      </p>

      <section className="flex flex-col gap-4 rounded-md bg-bedbug-cream-deeper p-5">
        <h2 className="text-2xl font-semibold text-bedbug-ink">Try this first</h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          Slow your breathing for a minute. In through your nose for four counts. Hold for
          four. Out through your mouth for four. Hold for four. Three or four times around.
        </p>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
          That&apos;s it. That&apos;s the whole exercise. Your body will catch up.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-bedbug-ink">Right now, what to do</h2>
        <ol className="flex flex-col gap-3">
          {RIGHT_NOW.map((step, i) => (
            <li key={i} className="flex items-start gap-3 rounded-md bg-bedbug-cream-deeper p-4">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-bedbug-sage text-bedbug-cream font-semibold"
              >
                {i + 1}
              </span>
              <span className="text-bedbug-body leading-snug text-bedbug-ink">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5">
        <h2 className="text-2xl font-semibold text-bedbug-ink">If it&apos;s worse than overwhelmed</h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          If you feel scared, or you can&apos;t think clearly, or something is happening
          that doesn&apos;t fit anywhere on this site — text Ben. He&apos;s there for that.
        </p>
      </section>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        You don&apos;t have to be brave about this. You just have to keep going at your own
        pace.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
