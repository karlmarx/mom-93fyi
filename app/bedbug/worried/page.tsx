import { BigButton } from "../_components/BigButton";

type Worry = {
  q: string;
  a: string;
};

const WORRIES: Worry[] = [
  {
    q: "I think I just saw a bug.",
    a: "Take a deep breath. Don't squash it. If it's on something you can move, move it inside a Ziploc and seal it — Ben can look at it next time he visits. Open the \"Ask Ben\" chat at the bottom of the page and describe what you saw: color, size, where it was, what it was doing. Ben will tell you what's most likely.",
  },
  {
    q: "I have new bites — at least I think they're bites.",
    a: "Most skin marks turn out not to be bed bugs, especially in Florida. Don't scratch them. Open the \"Ask Ben\" chat at the bottom of the page and describe them — where on your body, how many, color, whether they're in a line or scattered. There's a separate “Bites and skin” page that shows what bed bug bites usually look like vs. what doesn't — read that next.",
  },
  {
    q: "I touched something from the bedroom and forgot the gloves and outfit.",
    a: "It's okay. Wash your hands. Change your clothes — the ones you're wearing go in the dryer the next time you do a load. The bugs need to ride from one place to another on a person or a thing; one slip-up is not how this fails. The plan still works.",
  },
  {
    q: "I forgot to put the bedroom outfit on before going in.",
    a: "Same answer as above. Strip out of what you went in wearing as soon as you can — at the bedroom door if you can manage, in the bathroom otherwise. Those clothes go in the next dryer load. Wash your hands. Move on with your day.",
  },
  {
    q: "I think I left the bedroom door open all night.",
    a: "It's still okay. The cups under the bed are there for exactly this. The bugs don't fly. They have to walk across the floor and try to climb the legs of the bed — and the cups stop them. One night with the door open didn't ruin anything. Close it now and move on.",
  },
  {
    q: "I forgot to take the trash bags to the dumpster.",
    a: "It's okay. Take them out as soon as you can today. If they're sealed (knot tied at the top of both bags), they're not leaking anything into the apartment. The bags can sit by the door for a day without changing the outcome.",
  },
  {
    q: "I dropped a clean Ziploc on the floor.",
    a: "If the bag is still sealed, it's still clean. The outside of the bag touched the floor — but the clothes inside didn't. Wipe the bag with a hot wet cloth if you want, and put it back on the clean pile. Don't redo the dryer.",
  },
  {
    q: "I can't sleep. I keep feeling things on me.",
    a: "Phantom-itch is normal — your brain is on high alert and reading every twitch as a bug. It is not a sign that something is wrong. Try this: turn the light on, look at the sheets and your skin (just like the morning check), and tell yourself out loud what you see. If it's nothing, the looking helps your brain calm down. If it's something, the looking lets you take a picture for Ben. Either way, looking beats lying there.",
  },
  {
    q: "I'm exhausted and I just want to skip the laundry today.",
    a: "Skip it. One missed day does not break the plan. The plan is built around “one load a day, max” — that already assumes you might do zero some days. Rest is part of the plan, not a failure. Tomorrow's load can be tomorrow.",
  },
  {
    q: "I think I'm losing my mind. This is so much.",
    a: "You are not losing your mind. This is a lot, and it would be a lot for anyone. Pick the smallest possible next step — even just sitting down and drinking a glass of water counts. Then call Ben if you need to talk. The plan is not a deadline. Six months from now is fine. Twelve months is fine.",
  },
  {
    q: "I want to call the exterminator anyway.",
    a: "If you really want to, do it — but call Ben first and tell him. He has reasons it's probably not the right spend (mostly: the exterminator doesn't do any of the laundry work, which is most of the work, so $1,000 buys at most a third of the solution). If after that conversation you still want to, you can. It's your apartment.",
  },
  {
    q: "Someone wants to come over and I don't know what to say.",
    a: "It's okay to have visitors in the living room. The living room is now the clean part of the apartment — the new bed, the cups, the heat-treated clothes. Don't let anyone into the bedroom and don't sit on anything they brought from outside without checking it. They cannot catch bed bugs from a short visit; bed bugs travel in luggage and furniture, not on a person who comes by for an hour.",
  },
  {
    q: "I keep finding more clothes I forgot about.",
    a: "Add them to the laundry pile. One more bag is one more bag — the plan handles it. Don't try to do them all today. One a day, until you're done. There is no end-of-week deadline.",
  },
  {
    q: "I think I made a wrong choice about something I tossed.",
    a: "If it's already in the outdoor trash, let it go. Replace what you need. Aggressive triage is the right call here — you'll never regret throwing out one extra pillow, but you might regret keeping one extra hiding place. Tell Ben what it was if it was something serious; mostly the answer is “don't worry about it.”",
  },
  {
    q: "I haven't seen a bug in days. Is the plan working?",
    a: "Yes. That's exactly what working looks like. Empty cups, no new bites, no bugs on the sheets — that is the plan succeeding. The waiting feels strange because there's nothing to react to, but the waiting is the work. Six weeks of this is high confidence. Three months is very high confidence.",
  },
];

export default function WorriedPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          When something feels wrong
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          You haven&apos;t broken anything.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        The plan is built to handle small slip-ups. It does not need to be done
        perfectly to work. Here are the things that worry people most, and what
        to do about each one.
      </p>

      <ul className="flex flex-col gap-4">
        {WORRIES.map((w, i) => (
          <li key={i} className="rounded-md bg-bedbug-cream-deeper p-4">
            <p className="text-bedbug-body font-semibold text-bedbug-ink">
              {w.q}
            </p>
            <p className="mt-2 text-bedbug-body leading-relaxed text-bedbug-ink">
              {w.a}
            </p>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-2 rounded-md bg-bedbug-sage/15 p-5">
        <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
          When in doubt — take a breath, then a picture.
        </h2>
        <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
          A picture lets Ben see the thing the same way you do. He&apos;d
          rather get ten pictures of nothing than miss one picture of
          something. Texting him a picture is never a bother.
        </p>
      </section>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic leading-relaxed text-bedbug-ink">
        If confused — STOP — sit down — call Ben. He has the plan.
      </footer>

      <BigButton href="/bedbug" variant="ghost">
        Back to home
      </BigButton>
    </article>
  );
}
