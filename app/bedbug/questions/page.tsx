import Link from "next/link";
import { BigButton } from "../_components/BigButton";

type QA = { q: string; a: string };
type Section = { title: string; items: QA[] };

const SECTIONS: Section[] = [
  {
    title: "What comes out of the bedroom and what stays",
    items: [
      {
        q: "Should I empty my room and dresser of everything?",
        a: "Yes. Treat the bedroom as off-limits. Everything in there comes out: clothes, bedding, things on the dresser, things in drawers, things on the closet shelf. Sort each thing into one of three piles — heat-treat (clothes, soft stuff), seal-and-wait (a few things you really want to keep), or toss. When in doubt, toss.",
      },
      {
        q: "Besides the shirts, do the bags on the closet shelf come out too?",
        a: "Yes. Everything on the closet shelf comes out the same way as the rest of the bedroom. Whatever's already in a bag goes inside one of the new black contractor bags, sealed tight, and then either to the dryer (if it's clothes) or to the keep-pile in the living room.",
      },
      {
        q: "What about the suitcases? There might be bugs in them too.",
        a: "Vacuum each one inside and out — wheels, seams, every pocket and zipper. Then either toss them (easiest), or put them inside a sealed contractor bag with the date on it and don't open them for eighteen months. Bed bugs love luggage, so don't take chances with one you don't really need.",
      },
      {
        q: "What about the drawers in the side table by my chair — back floss, paperwork, all that?",
        a: "Empty each drawer onto a clean sheet on the floor. Paperwork goes into a Ziploc, sealed and dated. Hard plastic and metal things get a wipe-down with a hot wet cloth and go back into the drawer. Anything soft goes in a bag. The drawer itself: wipe the inside with the hot cloth.",
      },
      {
        q: "What about my boots, shoes, and slippers?",
        a: 'On the dryer rack so they don\'t tumble — HIGH heat, 30 minutes. Then they\'re clean and they live with you in the living room. (For the full list of how-to-treat-this-specific-thing, see "What do I do with this thing?" on the home page.)',
      },
      {
        q: "What about the bathroom cabinet?",
        a: "Don't worry about the bathroom. Bed bugs need soft places to hide and a body to feed on at night, and bathrooms have neither. Wipe the cabinet shelves out with a hot wet cloth and call it done.",
      },
    ],
  },
  {
    title: "The new bed, and the old one",
    items: [
      {
        q: "Should I throw out the old bed frame too, since I'll have a new mattress?",
        a: "Yes. The old wood sleigh bed has too many cracks and joints to ever clean reliably. The new metal frame coming Thursday replaces it completely. Old frame goes out with the old mattress.",
      },
      {
        q: "Same for the box spring?",
        a: "Yes — out with the old mattress. The new metal frame is a platform, so no box spring is needed at all.",
      },
      {
        q: "Should I set up the new bed when it comes?",
        a: "Yes — Thursday, in the living-room corner. Set aside about an hour. The frame needs assembly with the included Allen key (the small L-shaped tool in the box). The day-by-day list on the home page walks through it.",
      },
      {
        q: "Are the little black plastic cups for my new bed?",
        a: "Yes — those are the bed bug interceptors. Six of them go under the six legs of the new frame; the bugs walk into them and can't get back out. The other two cups sit on the bedroom floor as monitors, in case anything's still in there.",
      },
      {
        q: "If I throw out the old bed frame, where do I sit?",
        a: "You have your zero-gravity recliner and the coffee table you've been using. The new bed (in the living room) is also fine to sit on during the day. You're not losing anywhere to sit — the old frame was never the only option.",
      },
    ],
  },
  {
    title: "Bags, freezers, and wrinkled clothes",
    items: [
      {
        q: "Do I put the Ziploc bags of clothes in the freezer?",
        a: "No. The dryer is what kills the bugs, not the freezer. The Ziploc is just a sealed home for clothes that have already been through the dryer, so they stay clean while they wait their turn to be worn. Skip the freezer.",
      },
      {
        q: "Can I leave a few things out that I wear regularly, like a jacket?",
        a: "Yes. Anything you're wearing today goes through the dryer when you change out of it (HIGH, 45 min). Then it goes back to living with you in the living room — wear it like normal. The point isn't to lock everything away; it's to make sure it's been through the dryer first.",
      },
      {
        q: "Some clothes won't fit in a Ziploc bag.",
        a: "Use a clean kitchen trash bag or one of the big black contractor bags. The bag doesn't have to be a Ziploc — it just has to be clean, sealed, and labeled with today's date. Any sealed bag works.",
      },
      {
        q: "All my clothes are going to be wrinkled.",
        a: "They will, a little. Two easy fixes: hang the bag in the bathroom while you take a shower (the steam smooths most things out), or put the item in the dryer for five minutes on low or no-heat with a damp washcloth right before you wear it. Don't worry about it ahead of time.",
      },
      {
        q: "If I need to get paperwork out of a sealed bag, can I just close it again?",
        a: "Yes. Open it, take what you need, close it back up. As long as the bag stays sealed most of the time, you're fine. You don't have to redo anything.",
      },
    ],
  },
  {
    title: "Where bed bugs can be",
    items: [
      {
        q: "Can bed bugs travel from my bed to the living room?",
        a: "They can — by walking. They don't fly or jump. That's why we have the going-into-the-bedroom rules (special clothes + booties, then strip them at the door) and the cups under the new bed legs in the living room. Together those two things stop the trip.",
      },
      {
        q: "Can they get into my luggage?",
        a: "Yes. Luggage is one of their favorite places to hide because they hitchhike from house to house in suitcases. That's why the suitcases get vacuumed and sealed (or tossed). Don't keep one you're not really attached to.",
      },
      {
        q: "Can they hide in the crevices of my chair?",
        a: "Crevices are exactly where they hide. The zero-gravity recliner you've been using has fewer places to hide than an upholstered armchair, but check the seams when you're cleaning around it. If you see any sign of them on the chair, treat it like a bedroom item.",
      },
      {
        q: "The TV is in a cardboard box in the living room — can I leave it there?",
        a: "No. Take the TV out of the box and put the box in the trash today. Cardboard is one of the worst places to store anything during a bed bug situation — they love it. Wipe the TV down with a hot wet cloth and set it on the table or stand. The TV is fine. The box is the problem.",
      },
      {
        q: "Do bed bugs like boxes?",
        a: "Cardboard ones, very much. Plastic bins, no — they can't hide in smooth plastic and the seal keeps them out. If you need to store something, use a plastic bin with a lid, never a cardboard box.",
      },
    ],
  },
];

export default function QuestionsPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          Things you&apos;ve asked
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          Your questions, answered.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        These are good questions. Take them one at a time — none of this has to happen
        all at once.
      </p>

      {SECTIONS.map((section) => (
        <section key={section.title} className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-bedbug-ink">{section.title}</h2>
          <ul className="flex flex-col gap-4">
            {section.items.map((item, i) => (
              <li key={i} className="rounded-md bg-bedbug-cream-deeper p-4">
                <p className="text-bedbug-body font-semibold text-bedbug-ink">
                  {item.q}
                </p>
                <p className="mt-2 text-bedbug-body leading-relaxed text-bedbug-ink">
                  {item.a}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        If you start to feel like you&apos;re going crazy, you&apos;re not — this is a lot.
        Pick one thing. Do that one thing. Then rest. The plan works whether it takes you
        a week or two months.
      </footer>

      <p className="text-bedbug-body text-bedbug-ink/70">
        If your question isn&apos;t here, send Ben a text. He&apos;ll add the answer to
        this page.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/bedbug/items"
          className="block rounded-lg bg-bedbug-cream-deeper p-5 text-bedbug-ink hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
        >
          <span className="block text-bedbug-title font-semibold leading-snug">
            What do I do with this thing?
          </span>
          <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
            Specific procedures for shoes, books, electronics, etc.
          </span>
        </Link>
        <BigButton href="/bedbug" variant="ghost">
          Back to home
        </BigButton>
      </div>
    </article>
  );
}
