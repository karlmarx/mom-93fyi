import { HomeCard } from "./_components/HomeCard";

export default function BedbugHome() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-ink/60 text-sm uppercase tracking-wider">
          Mom&apos;s plan
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Bed bug plan
        </h1>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink/80">
          Four short pages. Read whichever one you need.
        </p>
      </header>

      <ul className="flex flex-col gap-4">
        <li>
          <HomeCard
            href="/bedbug/rules"
            title="The 5 rules"
            body="The whole plan, on one page."
          />
        </li>
        <li>
          <HomeCard
            href="/bedbug/bedroom"
            title="Going into the bedroom?"
            body="Read this every time before you open the bedroom door."
          />
        </li>
        <li>
          <HomeCard
            href="/bedbug/laundry"
            title="How to do a load of laundry"
            body="Step by step. Dryer first, then wash, then dryer again."
          />
        </li>
        <li>
          <HomeCard
            href="/bedbug/items"
            title="What do I do with this thing?"
            body="Shoes, books, electronics, suitcases. The answer for each."
          />
        </li>
        <li>
          <HomeCard
            href="/bedbug/questions"
            title="Things you've asked"
            body="Your questions, answered. Search any word — freezer, dog, suitcase — to jump to it."
          />
        </li>
      </ul>
    </div>
  );
}
