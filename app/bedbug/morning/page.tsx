import { BigButton } from "../_components/BigButton";

type Check = {
  number: number;
  title: string;
  what: string;
  ifYouSee: string;
};

const CHECKS: Check[] = [
  {
    number: 1,
    title: "Look at the 6 black cups under the bed legs.",
    what: "Bend down or sit on the floor. Look inside each of the six little black plastic cups under the legs of your new bed. They should be empty.",
    ifYouSee:
      "Anything in a cup — a bug, a speck, a flake — is good news, not bad news. The cup did its job. Take a phone picture and text it to Ben. Don't pour it out, don't touch it. Just leave the cup where it is and wait for him to look.",
  },
  {
    number: 2,
    title: "Look at the sheets and the mattress edge.",
    what: "Pull the top sheet down a little. Look at the bottom sheet under where you slept. Then look at the piped edge of the mattress where the seam runs. You're looking for tiny dark dots — like ballpoint-pen ink dots — or any small bug.",
    ifYouSee:
      "If you see ink-like dots, take a phone picture and text it to Ben. If you don't see anything, that's exactly what we want.",
  },
  {
    number: 3,
    title: "Look at your arms and legs.",
    what: "Pull up your sleeves. Roll up your pajama pants. Look at the skin on your forearms, your shins, the back of your knees, and your neck. Notice anything new since yesterday.",
    ifYouSee:
      "Take a picture (good light, near a coin or a fingernail for size) and text it to Ben. Most skin marks aren't bed bugs — but the picture is what tells him for sure. There's a whole page on this called “Bites and skin” on the home screen.",
  },
];

export default function MorningPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Every morning
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Three short checks. Then your day starts.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        These three checks take about a minute. Most mornings, you&apos;ll see
        nothing — and that&apos;s the whole point. The cups, the sheets, and
        your skin are how we know the plan is working.
      </p>

      <ol className="flex flex-col gap-4">
        {CHECKS.map((check) => (
          <li
            key={check.number}
            className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-bedbug-sage text-bedbug-cream text-2xl font-semibold"
              >
                {check.number}
              </span>
              <span className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
                {check.title}
              </span>
            </div>
            <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
              {check.what}
            </p>
            <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
              <span className="font-semibold">If you see something: </span>
              {check.ifYouSee}
            </p>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5">
        <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
          When you&apos;re done.
        </h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          Tell Ben &ldquo;all clear&rdquo; in the &ldquo;Ask Ben&rdquo; chat at
          the bottom of this page. If anything caught your eye, email him a
          picture at k@93.fyi. That&apos;s the whole morning routine.
        </p>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
          Three checks. One note. The rest of your day is yours.
        </p>
      </section>

      <section className="flex flex-col gap-2 rounded-md bg-bedbug-cream-deeper p-5">
        <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
          What an &ldquo;empty&rdquo; cup looks like
        </h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          The cups are little black plastic dishes with a smooth slippery moat
          on the inside. An empty cup has nothing in the moat — no bugs, no
          husks, no specks of dust bigger than a pinhead. A few normal flecks
          of carpet fluff are fine. If you can&apos;t tell, take a picture and
          text it.
        </p>
      </section>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic leading-relaxed text-bedbug-ink">
        Six weeks of empty cups and clean sheets means the plan is working.
        Three months means it&apos;s very likely already over. The morning
        check is how we count.
      </footer>

      <div className="flex flex-col gap-3">
        <BigButton href="/bedbug/bites" variant="ghost">
          Bites and skin — what to look for
        </BigButton>
        <BigButton href="/bedbug" variant="ghost">
          Back to home
        </BigButton>
      </div>
    </article>
  );
}
