import { BigButton } from "../_components/BigButton";

type Section = {
  title: string;
  body: string[];
};

const WHY: Section[] = [
  {
    title: "Heat kills them.",
    body: [
      "Bed bugs and their eggs cannot survive 30 minutes above about 120°F. A regular home dryer on HIGH heat hits 130–140°F and stays there — that is well past the kill point. Forty-five minutes is the setting because it gives the heat a margin of safety, especially for thicker things like jeans and bedspreads.",
      "This is why the very first 45 minutes in the dryer is the most important step in the entire plan, and why we dry before we wash. Wet clothes take three times longer to come up to temperature, and a warm wash is not hot enough to kill the eggs on its own. So: dryer first, then washer, then dryer again.",
    ],
  },
  {
    title: "Plastic contains them.",
    body: [
      "Bed bugs cannot bite through plastic, cannot crawl through a sealed seam, and cannot survive in a sealed bag without a body to feed on. A doubled-up trash bag, a Ziploc with the zipper closed, a plastic bin with the lid clipped — all of those are walls.",
      "That's why anything we pull out of the bedroom goes into a sealed bag immediately. The bag separates the bug from the rest of the apartment from the moment it leaves the bedroom until it reaches the dryer or the trash.",
    ],
  },
  {
    title: "Time finishes the rest.",
    body: [
      "A bed bug with no person to feed on starves. At normal indoor temperatures, an adult bed bug starves in four to six months. Eggs hatch within a week, and those new bugs starve too. After eighteen months sealed away from a body, every life stage is dead — that's the safety margin.",
      "This is the reason the bedroom door stays closed. Not because the room is full of poison, but because the room is full of nothing. A bug in there has nothing to eat. We don't need to chase it. We just have to wait.",
    ],
  },
  {
    title: "The cups under the bed are how we know.",
    body: [
      "The little black plastic cups have a smooth, slippery inside wall. A bed bug walking across the floor toward the bed climbs in to try to reach you, and can't climb back out. So they sit in the cup, alive, until you find them.",
      "That makes the cups the most reliable evidence either way: a cup with bugs in it tells us exactly what's still active. A cup that's stayed empty for weeks tells us, with high confidence, that the room is dying off and nothing is reaching the new bed.",
    ],
  },
  {
    title: "Why no exterminator.",
    body: [
      "An exterminator treats the room. He does not treat anyone's clothes, bedding, or belongings — that work is the resident's, every time. Without that work, even an expensive professional treatment fails almost half the time. So the $1,000 quote really only buys about a third of the solution.",
      "Heat from the dryer plus sealed bags plus interceptor cups plus time will resolve the great majority of cases on their own. If at the six-week mark the cups are still catching things or there are still new bites, an exterminator is a sensible next step — but only then, and only with the rest of the work already done.",
    ],
  },
  {
    title: "Why eighteen months is the number.",
    body: [
      "Adult bed bugs starve in four to six months. To allow for the unlikely case that a single egg, sheltered in the deepest crack of the carpet, hatches after the adults are already gone — and then that nymph also has to starve — eighteen months is the conservative end of every entomologist's recommendation.",
      "It's a long wait. It's also the cheapest, surest treatment in existence: it costs zero dollars and works because biology does the work, not us.",
    ],
  },
  {
    title: "Why this is sustainable.",
    body: [
      "The plan is paced for one load a day, max. Many days will be zero loads, and that's still the plan working. The goal is not heroic effort that burns you out by Saturday. The goal is steady, slow, predictable execution that you can keep doing for as long as it takes.",
      "If a week goes by and you've done two loads instead of seven — that is not a failure. That is the plan. The dryer keeps killing them. The plastic keeps holding them. Time keeps moving forward whether you do laundry today or not.",
    ],
  },
];

export default function WhyPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Why this plan works
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Heat. Plastic. Time.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        Three simple things kill bed bugs. None of them are a chemical, and
        none of them require an exterminator. Here is why we trust each one.
      </p>

      <div className="flex flex-col gap-6">
        {WHY.map((section, i) => (
          <section
            key={i}
            className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5"
          >
            <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
              {section.title}
            </h2>
            {section.body.map((p, j) => (
              <p
                key={j}
                className="text-bedbug-body leading-relaxed text-bedbug-ink"
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic leading-relaxed text-bedbug-ink">
        You don&apos;t have to know the science to follow the plan. But if you
        ever wonder &ldquo;why am I doing this&rdquo; in the middle of a load
        of laundry — that&apos;s the answer. Heat. Plastic. Time.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
