import { BigButton } from "../_components/BigButton";

const RIGHT_NOW = [
  "Sit on the recliner.",
  "Drink some water.",
  "Watch something on TV, or call a friend, or just close your eyes.",
  "The bedroom can wait. So can everything else.",
];

type Fact = {
  fear: string;
  truth: string;
};

const FACTS: Fact[] = [
  {
    fear: "If I sleep on the new mattress, the bugs will come find me there.",
    truth:
      "The black plastic cups under the bed legs are little moats. Bed bugs can climb wood and fabric, but they cannot climb the smooth plastic walls — they fall in and can't get out. As long as the bed isn't touching the wall and the sheets don't touch the floor, the new bed is a safe island. That's the whole engineering trick.",
  },
  {
    fear: "I have to live out of contractor bags for months.",
    truth:
      "No. The bags are for two specific things: soft stuff you don't need for daily life (extra sheets, off-season clothes, blankets) and clothes you've already heat-killed in the dryer. Your everyday clothes, toiletries, kitchen, all your normal life — stays accessible. Living out of trash bags is not the plan and never was.",
  },
  {
    fear: "They are all over this apartment by now.",
    truth:
      "Maybe, maybe not — and the cups will tell you. Once they're under the new bed legs, anything in the bedroom that walks toward the bed falls into a cup. After a week of empty cups, you have your answer. If something does turn up in a cup, take a picture and text Ben — that's information, not bad news.",
  },
  {
    fear: "They travel between apartments to find me.",
    truth:
      "More like a slow drift than a daily commute. Bed bugs prefer to stay within 5 to 20 feet of where they last fed. They don't seek out new bodies in other apartments unless an existing population gets very crowded. The neighbors aren't relevant to your treatment.",
  },
  {
    fear: "They multiply too fast to keep up with.",
    truth:
      "They multiply, but slowly — a female lays a few eggs a day, eggs hatch in a week. They can survive a long time between meals (that's why the cups stay under the bed for 3 months) but they can't multiply if they can't reach you. The cups are how we make sure they can't.",
  },
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

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-bedbug-ink">
          When you&apos;re ready — five things that might help
        </h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
          Read these slowly. Skip any that don&apos;t apply.
        </p>
        <ul className="flex flex-col gap-4">
          {FACTS.map((fact, i) => (
            <li key={i} className="rounded-md bg-bedbug-cream-deeper p-5">
              <p className="text-bedbug-body font-semibold italic text-bedbug-ink/70">
                &ldquo;{fact.fear}&rdquo;
              </p>
              <p className="mt-3 text-bedbug-body leading-relaxed text-bedbug-ink">
                {fact.truth}
              </p>
            </li>
          ))}
        </ul>
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
