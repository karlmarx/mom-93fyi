import { BigButton } from "../_components/BigButton";

type Block = {
  title: string;
  body: string[];
};

const BED_BUG_LOOK: Block = {
  title: "What bed bug bites typically look like",
  body: [
    "Small, raised, red bumps — about the size of a mosquito bite or a little smaller. They itch.",
    "Often, but not always, in a line of two or three close together — sometimes called a “breakfast, lunch, and dinner” pattern, because the bug bit, moved a little, and bit again.",
    "On parts of the skin that were not under blankets or clothes when you slept: forearms, the side of the neck, the back of the calves.",
    "Some people don't react to bed bug bites at all and never get bumps — that's also normal, and it doesn't mean you don't have them. It just means the picture by itself isn't the whole answer.",
  ],
};

const NOT_BED_BUGS: Block[] = [
  {
    title: "Dry skin",
    body: [
      "Very common, especially as we get older or when the air conditioner runs all the time. Dry skin can look red, blotchy, scaly, and it itches. The skin underneath feels rough or papery, not raised in a single spot.",
      "If a thick lotion or a hot shower for a few days makes the patch fade, it was dry skin.",
    ],
  },
  {
    title: "An allergic reaction to a detergent, soap, or lotion",
    body: [
      "If you've started using a new laundry detergent, fabric softener, body wash, or lotion in the last month or two, that is a very common cause of itchy patches.",
      "The pattern is usually wherever the cloth or the lotion touched: around the waistband, under the bra strap, on the inside of the elbow.",
    ],
  },
  {
    title: "Mosquito or other Florida insect bites",
    body: [
      "Florida and a single open door is enough. Mosquito bites can look almost exactly like bed bug bites — round, raised, itchy. The difference is usually that mosquito bites show up after you've been outside or near a window, not after you've slept.",
    ],
  },
  {
    title: "Flea bites",
    body: [
      "Concentrated on the lower legs and ankles, almost always — fleas don't travel up. They show up if there's been any contact with a pet or a place a pet has been. Usually appear as a cluster of small, hard red bumps.",
    ],
  },
  {
    title: "Folliculitis or skin friction",
    body: [
      "Tiny red bumps centered on a hair follicle, often around the bra line, the inside of the thighs, or anywhere clothes rub a lot. Looks scary up close but is harmless and clears on its own.",
    ],
  },
  {
    title: "Scabies",
    body: [
      "Scabies is a different mite — not a bed bug. It tunnels under the skin and itches especially at night. Tiny lines or threadlike marks between the fingers or on the wrists are the giveaway. It's worth ruling out because the treatment is a single prescription cream, not pest control.",
      "If your doctor thinks it might be this, you'll know in ten minutes — Medicare covers the visit.",
    ],
  },
];

export default function BitesPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Bites and skin
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Most skin marks aren&apos;t bed bug bites.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        Bites alone do not prove there are bed bugs. The proof is finding a
        bug, finding eggs, or finding the small dark fecal dots they leave on
        sheets. So when you see a new spot on your arm or your leg, the answer
        is almost never &ldquo;don&apos;t worry&rdquo; or &ldquo;definitely
        bed bugs&rdquo; — the answer is take a picture and let Ben see it.
      </p>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-5">
        <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
          {BED_BUG_LOOK.title}
        </h2>
        {BED_BUG_LOOK.body.map((p, i) => (
          <p
            key={i}
            className="text-bedbug-body leading-relaxed text-bedbug-ink"
          >
            {p}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-bedbug-ink">
          What gets confused with bed bug bites
        </h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          Most of the time, an itchy spot turns out to be one of these — none
          of them are bed bugs.
        </p>
        <ul className="flex flex-col gap-4">
          {NOT_BED_BUGS.map((block, i) => (
            <li
              key={i}
              className="flex flex-col gap-2 rounded-md bg-bedbug-cream-deeper p-5"
            >
              <h3 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
                {block.title}
              </h3>
              {block.body.map((p, j) => (
                <p
                  key={j}
                  className="text-bedbug-body leading-relaxed text-bedbug-ink"
                >
                  {p}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-md bg-bedbug-sage/15 p-5">
        <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
          What to do if you see a new mark.
        </h2>
        <ol className="flex list-inside list-decimal flex-col gap-2 text-bedbug-body leading-relaxed text-bedbug-ink">
          <li>Don&apos;t scratch it. Try not to.</li>
          <li>
            Take a clear close-up picture. Good light. Put a coin or your
            fingernail in the frame so Ben can see the size.
          </li>
          <li>Text the picture to Ben.</li>
          <li>
            If you have several new ones in a row on a part of your body that
            was uncovered while you slept, mention that.
          </li>
          <li>Then go on with your day. Don&apos;t stare at it.</li>
        </ol>
      </section>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic leading-relaxed text-bedbug-ink">
        If something keeps bothering you for more than a few days, or you have
        a lot of marks all at once, your doctor can take a look — usually a
        ten-minute visit, covered by Medicare. A dermatologist or your regular
        primary-care doctor can rule most of these in or out on the spot.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
