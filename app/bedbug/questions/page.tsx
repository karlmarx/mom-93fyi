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
        a: "On the dryer rack so they don't tumble — HIGH heat, 30 minutes. Then they're clean and they live with you in the living room. (For the full list of how-to-treat-this-specific-thing, see “What do I do with this thing?” on the home page.)",
      },
      {
        q: "What about the bathroom cabinet?",
        a: "Don't worry about the bathroom. Bed bugs need soft places to hide and a body to feed on at night, and bathrooms have neither. Wipe the cabinet shelves out with a hot wet cloth and call it done.",
      },
      {
        q: "Do I have to wipe down the inside of the closet?",
        a: "Yes, but it's a one-time job. After you've taken everything out of the closet, wipe the shelves and the rod with a hot wet cloth. You don't need to spray anything. Then leave the closet empty until eighteen months from when you sealed the room, same as the rest of it.",
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
        a: "Yes — Thursday, in the living-room corner. Set aside about an hour. The frame needs assembly with the included Allen key (the small L-shaped tool in the box). The “🛏️ The new bed” page on the home screen walks through it.",
      },
      {
        q: "Are the little black plastic cups for my new bed?",
        a: "Yes — those are the bed bug interceptors. Six of them go under the six legs of the new frame; the bugs walk into them and can't get back out. The other two cups sit on the bedroom floor as monitors, in case anything's still in there.",
      },
      {
        q: "If I throw out the old bed frame, where do I sit?",
        a: "You have your zero-gravity recliner and the coffee table you've been using. The new bed (in the living room) is also fine to sit on during the day. You're not losing anywhere to sit — the old frame was never the only option.",
      },
      {
        q: "How long do I have to sleep in the living room?",
        a: "However long it takes you to feel sure. Some people are comfortable moving back to the bedroom at six months; others wait the full eighteen. The cups under the new bed in the living room are working for you the whole time, so there's no rush. The living room is your real bedroom now until you decide otherwise.",
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
      {
        q: "Do the Ziplocs need to be the “bed bug” brand?",
        a: "No. Any clear sealable bag works — Ziploc, Hefty, the store brand, whatever you have. The job is to seal, not to filter. Big freezer bags and 2-gallon storage bags are the most useful sizes.",
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
      {
        q: "Can they live behind a picture frame or in the wall outlet?",
        a: "In an active infestation, sometimes — they hide in any small dark crack. But once the food source (you) leaves the bedroom, those little hiding spots stop being places they can stay. A bug hiding behind a picture frame eventually has to come out to feed, and when it walks across the floor it lands in one of the interceptor cups in the bedroom or the living room. You don't need to dismantle the wall outlets.",
      },
    ],
  },
  {
    title: "Sleep, calm, feeling like it's a lot",
    items: [
      {
        q: "I keep feeling things crawling on me. Are they real?",
        a: "Probably not — that sensation is your brain on high alert, reading every twitch and brush of fabric as a bug. It's called phantom-itch and it is normal and very common during a bed bug situation. It does not mean you're imagining things; it means your nervous system is doing its job a little too well. The feeling fades as the weeks of empty cups stack up.",
      },
      {
        q: "I can't sleep. What can I do?",
        a: "Turn the light on and look — at the sheets, at your skin. Naming what you see (out loud is fine) calms the alert response down faster than lying still and trying to ignore it. Most nights you'll see nothing, and that's the point. If something is there, you'll have a picture for Ben.",
      },
      {
        q: "I'm exhausted. Can I just rest for a few days?",
        a: "Yes. The plan is built for one load a day MAX, and many days will be zero. Heat, plastic, and time are doing the work whether you do laundry today or not. Take three days off. The cups will still be empty when you come back to them.",
      },
      {
        q: "Is it normal to feel a little crazy from this?",
        a: "Yes. It's normal. It's a lot to handle alone, and the constant low-grade alarm wears anyone down. That's separate from the bed bugs and worth telling someone about — Ben, a friend, your doctor. Talking about it makes it smaller. You are not making any of this up.",
      },
      {
        q: "I keep checking the cups every hour. Should I stop?",
        a: "Yes. Once a day, in the morning, is plenty. Checking more often doesn't make the cups work better — they catch the same bugs whether you look or not. If you find that you can't stop checking, that's a sign to step away, do something else, and come back tomorrow. The plan does not require constant attention.",
      },
    ],
  },
  {
    title: "How long, and how we'll know it's working",
    items: [
      {
        q: "How long does this whole thing take?",
        a: "Six weeks of empty cups and clean sheets is high confidence. Three months is very high confidence. Eighteen months is when the sealed bedroom items can come out and the closed-off bedroom is fully released. The first six weeks is the active part — after that, you mostly wait.",
      },
      {
        q: "What does “the plan is working” actually look like?",
        a: "Nothing. That's the strange part. It looks like empty cups, no new bites, no bugs on the sheets, no specks of black on the mattress edge. The plan working looks like nothing happening for weeks at a time. Sameness is the goal.",
      },
      {
        q: "When can I open the bedroom door again?",
        a: "Whenever you want, after about eighteen months. Some people open it earlier and just don't sleep there. The bedroom isn't dangerous to walk into — it's just better to leave it sealed because every day with no food source brings the colony closer to gone. There's no penalty if you go in for ten minutes; just put the bedroom outfit on first.",
      },
      {
        q: "What if at six weeks the cups have caught something?",
        a: "That's still useful — it tells us where we are. We adjust: maybe a steamer along the carpet edge, maybe a real exterminator at that point if the activity is heavy. But it's a single fork in the road, not a failure of the plan. You'll have spent ~$95 instead of $1,000 and you'll know what to spend on next.",
      },
      {
        q: "What if I never see a single bug? Did I imagine all this?",
        a: "Not necessarily. Many people resolve a bed bug situation without ever finding a live bug — the heat-treated clothes, the cups, and the closed door are working faster than the bugs can travel. That's the plan succeeding by being unboring. Ben can also tell from the bites and the timeline whether the worry was real, but either way, the plan has cost almost nothing and you're back to normal.",
      },
    ],
  },
  {
    title: "Visitors, family, and going out",
    items: [
      {
        q: "Can someone come visit me?",
        a: "Yes — in the living room. The living room is now the clean part of the apartment. They can sit, drink coffee, watch TV, hug you. Don't take anyone into the bedroom. Don't sit on a bag or coat they brought from outside without giving it a once-over. They cannot catch bed bugs from a normal visit.",
      },
      {
        q: "Should I tell people I have bed bugs?",
        a: "Up to you. There's no reason to hide it — bed bugs are not about cleanliness, they're about luck and travel. Many people get them once in their life. The people who love you would rather know so they can help. The people who'd judge you for it aren't worth worrying about today.",
      },
      {
        q: "Can I go to a friend's house?",
        a: "Yes. Wear clothes from a clean Ziploc, and either leave your usual bag at home or take a tote you can wash on hot when you get back. Don't bring anything from the bedroom — but you weren't planning to. The risk of carrying a bug to someone else's house in your clothes is very low if those clothes have been through the dryer.",
      },
      {
        q: "Can I have my grandkids over?",
        a: "Yes. Same answer as a visitor — keep them in the living room, don't let them play in the bedroom. Kids do not catch bed bugs from a visit; the bugs need a place to hide and many hours to spread, neither of which a few hours of grandkid time gives them.",
      },
      {
        q: "Can I go to the doctor / pharmacy / grocery store?",
        a: "Yes. Wear clean Ziploc clothes. Live your life. The plan does not require house arrest. You can go anywhere a person normally goes — the dryer cycle has already done its job on what you're wearing.",
      },
    ],
  },
  {
    title: "Apartment, neighbors, and the landlord",
    items: [
      {
        q: "Should I tell my neighbors?",
        a: "Generally no — there's nothing they can do, and bed bugs don't crawl through walls in a way that means anyone next door is in danger from your apartment. If a neighbor mentions seeing something, then it's worth comparing notes. Otherwise, this is your business.",
      },
      {
        q: "Should I tell the landlord?",
        a: "Talk to Ben before you do. The answer depends on the lease — in some buildings the landlord has to treat at no cost, in others they pass the cost back to you, and in some they will pressure you into an expensive treatment that doesn't actually solve anything (see: the $1,000 question). Ben can read the lease language with you on a call.",
      },
      {
        q: "Could I have brought them in from somewhere?",
        a: "Maybe. Bed bugs hitchhike on luggage, used furniture, and sometimes shared laundry rooms. The most common ways are: a hotel room (even a clean one), a piece of secondhand furniture, or a friend's couch where there was already a problem. Don't try to figure out where; that doesn't change what we do next, which is the plan.",
      },
      {
        q: "What about the apartment's shared laundry room?",
        a: "It is fine to use, with the same routine: dryer first 45 min on HIGH, then wash on hot, then dryer again. Don't set the bag of dirty clothes on top of the machine while you wait. Empty it straight in. Take both bags to the outdoor trash before you do anything else. The dryer kills whatever the bag was holding.",
      },
    ],
  },
  {
    title: "Cleaning supplies and detergent",
    items: [
      {
        q: "What detergent should I use?",
        a: "Any regular laundry detergent. Tide, Persil, the cheap store brand — they all work the same for our purposes. The wash isn't what kills bed bugs (the dryer is), so the detergent doesn't matter much. If you want fewer skin reactions, use a fragrance-free or “free and clear” version.",
      },
      {
        q: "Do I need to use bleach?",
        a: "No. Bleach is hard on skin and clothes and isn't necessary. Hot water + regular detergent + the dryer does the job.",
      },
      {
        q: "What about a bed bug spray?",
        a: "Skip it. Most over-the-counter bed bug sprays are not very effective, and many bed bugs are now resistant to the chemicals in them. The dryer, the bags, and the cups are doing the real work. Save your money.",
      },
      {
        q: "Can I use rubbing alcohol on something?",
        a: "Yes — 91% isopropyl alcohol on a paper towel is a useful tool for cracks, zippers, and seams where soap won't go. It kills on contact. Don't use it as a spray on furniture; it can damage finishes and isn't a substitute for the heat treatment.",
      },
      {
        q: "What about diatomaceous earth?",
        a: "Useful for the carpet edges if we end up needing it later — but we are not using it now. The plan starts with the simplest things first (heat, plastic, cups). If after six weeks we need more, Ben will tell you.",
      },
    ],
  },
  {
    title: "Pets, and other living things",
    items: [
      {
        q: "Will bed bugs bite my pet?",
        a: "If you have a pet, bed bugs will bite them too — but it's much less common than biting a person, because most pets have fur in the way. The pet does not need a special treatment. Bed bugs do not live on pets the way fleas do; they hide in the bed and walk over to feed at night.",
      },
      {
        q: "Can I bathe / clean the pet differently?",
        a: "No special bathing routine is needed. Wash the pet's bedding, blanket, or favorite cloth toy in the same dryer-first / wash-hot / dryer-again routine you use for your own. Treat their stuff like your stuff.",
      },
      {
        q: "What if my pet sleeps with me?",
        a: "Then they sleep on the new bed in the living room with the cups under the legs, just like you. Same plan, same cups, same protection.",
      },
    ],
  },
  {
    title: "The dryer and the laundry routine",
    items: [
      {
        q: "Can I do two loads at the same time in different machines?",
        a: "If your machines can both run, yes. The plan only says one load AT A TIME relative to handling — so you don't accidentally mix bags. Two dryers running on HIGH at the same time is fine, as long as each load is its own sealed bag in and its own sealed Ziploc out.",
      },
      {
        q: "Why dryer first, then wash, then dryer again?",
        a: "The first dryer pass is the kill step (heat). The wash is the clean step (gets sweat, dust, dirt, and dead bugs out). The second dryer pass dries them so you can put them away. Skipping the first dryer pass and only washing-and-drying once is the most common mistake, because bed bug eggs survive a warm wash but not a hot dryer.",
      },
      {
        q: "Do I have to do every load this way forever?",
        a: "No — only during the active phase, the first six weeks or so. After that, the bedroom is closed off, your wardrobe is in clean Ziplocs, and there's nothing left in the apartment that needs the dryer-first treatment. You go back to normal laundry. Ben will tell you when.",
      },
      {
        q: "What if my dryer breaks down or I run out of quarters?",
        a: "Don't panic. Sealed bags are stable — the bugs don't escape from them. A bag of dirty clothes can sit by the door for two weeks if it has to. Get the dryer fixed (or use the apartment's other dryer, or a laundromat) and pick up where you left off.",
      },
      {
        q: "Can I dry-clean things instead?",
        a: "Most dry-cleaning chemicals also kill bed bugs, and the heat in the dry-cleaning press helps too. But you have to tell the dry cleaner what's going on, because you don't want them mixing your stuff with someone else's coat. Easier just to use your own dryer when you can.",
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
        These are good questions. Take them one at a time — none of this has
        to happen all at once. Use your phone&apos;s find-on-page (the magnifier
        icon at the top of your browser) to jump to a word like
        &ldquo;dryer&rdquo; or &ldquo;suitcase&rdquo; or &ldquo;visitor&rdquo;
        if you don&apos;t see it.
      </p>

      <nav
        aria-label="Topics"
        className="rounded-md bg-bedbug-cream-deeper p-4"
      >
        <p className="text-bedbug-body font-semibold text-bedbug-ink">
          Jump to a topic:
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <li key={s.title}>
              <a
                href={`#${slug(s.title)}`}
                className="text-bedbug-body underline underline-offset-4 text-bedbug-ink"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {SECTIONS.map((section) => (
        <section
          key={section.title}
          id={slug(section.title)}
          className="flex scroll-mt-6 flex-col gap-4"
        >
          <h2 className="text-2xl font-semibold text-bedbug-ink">
            {section.title}
          </h2>
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

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic leading-relaxed text-bedbug-ink">
        If you start to feel like you&apos;re going crazy, you&apos;re not —
        this is a lot. Pick one thing. Do that one thing. Then rest. The plan
        works whether it takes you a week or two months.
      </footer>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink/70">
        If your question isn&apos;t here, send Ben a text. He&apos;ll add the
        answer to this page.
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
        <Link
          href="/bedbug/worried"
          className="block rounded-lg bg-bedbug-cream-deeper p-5 text-bedbug-ink hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
        >
          <span className="block text-bedbug-title font-semibold leading-snug">
            When something feels wrong
          </span>
          <span className="mt-1 block text-bedbug-body text-bedbug-ink/70">
            Slip-ups, missed steps, and not-sleeping-well — what to do.
          </span>
        </Link>
        <BigButton href="/bedbug" variant="ghost">
          Back to home
        </BigButton>
      </div>
    </article>
  );
}

function slug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
