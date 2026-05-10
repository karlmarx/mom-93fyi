import { BigButton } from "../_components/BigButton";

type Category = {
  what: string;
  examples?: string;
  answer: string;
};

const CATEGORIES: Category[] = [
  {
    what: "Regular clothes, sheets, towels",
    examples: "Tops, pants, underwear, pajamas, socks, sheets, pillowcases, bath towels.",
    answer:
      "Dryer first (HIGH HEAT, 45 minutes — that's what kills the bugs). Then wash on hot. Then dryer again, 45 minutes. Sealed Ziploc with today's date.",
  },
  {
    what: "Shoes and sneakers",
    answer:
      "On the dryer rack so they don't tumble. HIGH heat, 30 minutes. No wash needed.",
  },
  {
    what: 'Wool, silk, or anything that says "dry-clean only"',
    answer:
      "Dryer 90 minutes on LOW heat — that's enough on its own. Don't wash these. If the tag really says do-not-tumble-dry, send Ben a picture of the tag and ask.",
  },
  {
    what: "Pillows",
    answer:
      "If they're washable: dryer 45 minutes, then wash, then dryer again. If they're old or stained: toss.",
  },
  {
    what: "Small electronics",
    examples: "Boombox, lamp, alarm clock, phone charger.",
    answer:
      "Wipe the outside. Seal in a plastic bin for two weeks. Mark the date on the bin.",
  },
  {
    what: "Books, papers, photos",
    answer:
      "If you really want to keep it: sealed plastic bin, eighteen months, dated. Otherwise: toss.",
  },
  {
    what: "Cardboard boxes",
    answer:
      "Always toss. Bed bugs love cardboard. Use plastic bins instead if you need storage.",
  },
  {
    what: "Suitcases (hard-shell, rolling plastic)",
    answer:
      "Don't toss. Empty them. Wipe inside and out with hot soapy water (Dawn or any dish soap). Pay extra attention to the zipper tracks and the seams along the edges. Let dry, then store in the living room.",
  },
  {
    what: "Suitcases (fabric or canvas)",
    answer:
      "Don't toss. Empty them. If it fits in the dryer: 45 minutes on HIGH. If it doesn't: put the empty suitcase by itself inside a black contractor bag, seal it, leave it in a hot sunny window or bathtub for 2 weeks. Heat kills them.",
  },
  {
    what: "Hard surfaces — what to wipe with",
    examples: "Suitcases, plastic bins, nightstand top, dresser drawers if you're keeping it.",
    answer:
      "Hot soapy water (just Dawn or any dish soap) is fine for most things. For zippers, seams, and cracks where soap won't reach: 91% isopropyl alcohol on a paper towel — kills on contact. Don't waste money on bed-bug sprays.",
  },
  {
    what: "Old or stained clothes you don't really wear",
    answer:
      'Toss. Bag, label "BED BUGS" in big letters, take to the outdoor trash.',
  },
  {
    what: "Curtains",
    answer:
      "Take them down. If they fit in the dryer, dryer first 45 min on HIGH, then wash, then dryer again — same as clothes. If they're too big, fold them into a sealed contractor bag and keep them in the closed bedroom for eighteen months. Then put them back up.",
  },
  {
    what: "Wall art and picture frames",
    examples: "Photos, paintings, framed needlework on the bedroom wall.",
    answer:
      "Take them off the wall. Wipe the front and back of each frame with a hot wet cloth. Pay attention to the corners and the back where dust collects. They can move to the living room or stay leaning against the wall in the bedroom — they're hard plastic/wood/glass and not a hiding spot once wiped.",
  },
  {
    what: "Stuffed animals and soft toys",
    answer:
      "Dryer 45 minutes on HIGH, just like clothes. If a toy is fragile or too big for the dryer, seal in a plastic bin for eighteen months. Don't keep one that you can't bear to either heat or seal.",
  },
  {
    what: "Houseplants",
    answer:
      "Bed bugs do not live on or in houseplants. Move them out of the bedroom into the living room and water them like normal. The dirt is fine. The leaves are fine. Skip them entirely.",
  },
  {
    what: "Lamps, cords, and chargers",
    answer:
      "Wipe the lamp body, the bulb (cool, please), the cord, and the plug with a hot wet cloth. They go to the living room. Don't seal cords in plastic — they overheat. Wiping is enough.",
  },
  {
    what: "Kitchen things — pots, pans, dishes, cookware",
    answer:
      "Don't worry about them. Bed bugs don't live in kitchens (no soft places to hide, no body to feed on). The kitchen does not need any special treatment. Keep cooking and eating as usual.",
  },
  {
    what: "Something you love that can't go in the dryer",
    answer: "Sealed plastic bin. Eighteen months. Date the bin. Open it then.",
  },
];

export default function ItemsPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          What do I do with this?
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Pick the kind of thing you&apos;re holding.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        The answer is on this page. If your thing isn&apos;t here, send Ben a picture
        and he&apos;ll tell you.
      </p>

      <ul className="flex flex-col gap-4">
        {CATEGORIES.map((cat, i) => (
          <li key={i} className="rounded-md bg-bedbug-cream-deeper p-4">
            <div className="flex flex-col gap-1">
              <span className="text-bedbug-body font-semibold text-bedbug-ink">
                {cat.what}
              </span>
              {cat.examples ? (
                <span className="text-bedbug-body text-bedbug-ink/60">
                  {cat.examples}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-bedbug-body leading-relaxed text-bedbug-ink">
              {cat.answer}
            </p>
          </li>
        ))}
      </ul>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        When in doubt, toss it. Things can be replaced. Your peace of mind is worth more.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
