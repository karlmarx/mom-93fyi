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
    what: "Old or stained clothes you don't really wear",
    answer:
      'Toss. Bag, label "BED BUGS" in big letters, take to the outdoor trash.',
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
