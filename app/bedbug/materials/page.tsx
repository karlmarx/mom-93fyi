import Link from "next/link";
import { BigButton } from "../_components/BigButton";
import { PhotoSlot } from "../_components/PhotoSlot";

// The actual products in order #2000143-65988013 + #112-3773124-8950658.
// If the order changes, edit this list AND docs/plan.md Section 6 together.
type Material = {
  id: string; // photo slot id at /public/photos/material-<id>.jpg
  name: string;
  what: string;
  forWhat: string;
  packagingNote?: string;
};

const MATERIALS: Material[] = [
  {
    id: "casa-platino-sheets",
    name: "Casa Platino cotton sheets, twin, white",
    what: "A 3-piece cotton sheet set — flat sheet, fitted sheet, one pillowcase. White, percale weave, 15-inch deep pocket.",
    forWhat:
      "These are the new sheets for the new bed. Leave them sealed in the original packaging in the living room until mattress day. Sealed in plastic from the factory means clean — no laundry needed before you put them on.",
    packagingNote:
      "Don't open the package early. The plastic is doing work for us.",
  },
  {
    id: "cozy-city-frame",
    name: "Cozy City 14-inch metal bed frame",
    what: "A black metal platform bed frame. Twin size. Six legs. No box spring needed — the frame itself is the platform.",
    forWhat:
      "The new bed lives on this frame in the living room. The six legs each sit in one of the little black plastic interceptor cups.",
    packagingNote:
      "There's an Allen key in the box — the small L-shaped tool. You need it to put the frame together. Keep it nearby until you're done. The cardboard box goes straight to the trash; bed bugs love cardboard.",
  },
  {
    id: "zenden-mattress",
    name: "ZenDen 8-inch memory foam mattress, twin",
    what: "An 8-inch memory foam mattress, medium-firm, twin size. Ships compressed in plastic; expands when you open it.",
    forWhat:
      "Goes on top of the Cozy City frame. No box spring. Slip the SafeRest waterproof cover over it before making the bed.",
    packagingNote:
      "Open the plastic in the living room, near the frame. Memory foam takes a few hours to fully expand — that's normal. Give it a couple hours before you sleep on it. The plastic wrap goes straight to the trash.",
  },
  {
    id: "saferest-protector",
    name: "SafeRest waterproof mattress protector, twin",
    what: "A white fitted waterproof cover. It hugs the top and sides of the mattress like a fitted sheet — it does not zip closed.",
    forWhat:
      "Goes on the new mattress before the sheets. Keeps the mattress surface clean and gives bed bugs no easy place to hide on top of the mattress.",
    packagingNote:
      "Note: the corners are open — this is a fitted protector, not a fully zippered encasement. The black cups under the bed legs are what stop bed bugs from getting up to the mattress in the first place. If anything ever shows up in a cup, Ben will help you swap this for a zippered one.",
  },
  {
    id: "interceptors",
    name: "Bed bug interceptor cups — 8-pack, black plastic",
    what: "Eight little black plastic dishes. Each one looks like a small saucer with an inner moat.",
    forWhat:
      "Six of them go under the six legs of the new bed frame — one cup per leg. The other two sit on the bedroom floor, near the door and along the wall, as monitors. If anything's still in the bedroom, the cups will catch it.",
    packagingNote:
      "If the cardboard packaging has any kind of insert, toss it. Just keep the cups themselves.",
  },
  {
    id: "contractor-bags",
    name: "Commander 55-gallon heavy-duty contractor bags",
    what: "Big black 3-mil thick trash bags. Much sturdier than regular kitchen bags.",
    forWhat:
      "Use these for laundry runs (TWO bags per run — one bag inside the other) and for sealing bedroom contents you're throwing out. The thickness is the point: bed bugs can chew through thin bags.",
    packagingNote:
      "Take the bags out of the box and toss the box. Cardboard belongs in the outdoor trash.",
  },
];

export default function MaterialsPage() {
  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-bedbug-cream p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-2">
        <span className="text-bedbug-sage text-sm font-semibold uppercase tracking-wider">
          What you ordered
        </span>
        <h1 className="text-bedbug-title font-semibold leading-tight text-bedbug-ink">
          The boxes coming to the door.
        </h1>
      </header>

      <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
        Each box has one thing. Open the matching card here to see what
        it is, what it&apos;s for, and what to do with the wrapping.
      </p>

      <ul className="flex flex-col gap-5">
        {MATERIALS.map((m) => (
          <li
            key={m.id}
            className="flex flex-col gap-3 rounded-md bg-bedbug-cream-deeper p-4"
          >
            <PhotoSlot id={`material-${m.id}`} alt={m.name} />
            <h2 className="text-bedbug-title font-semibold leading-snug text-bedbug-ink">
              {m.name}
            </h2>
            <div className="flex flex-col gap-2">
              <span className="text-bedbug-body font-semibold text-bedbug-ink/80">
                What it is
              </span>
              <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
                {m.what}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-bedbug-body font-semibold text-bedbug-ink/80">
                What it&apos;s for
              </span>
              <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
                {m.forWhat}
              </p>
            </div>
            {m.packagingNote ? (
              <div className="flex flex-col gap-2 rounded-md bg-bedbug-cream p-3">
                <span className="text-bedbug-body font-semibold text-bedbug-ink/80">
                  About the box
                </span>
                <p className="text-bedbug-body leading-relaxed text-bedbug-ink">
                  {m.packagingNote}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <footer className="rounded-md bg-bedbug-cream-deeper p-4 text-bedbug-body italic text-bedbug-ink">
        If a box arrives that isn&apos;t on this page, don&apos;t open it
        until you check with Ben. Photos help.
      </footer>

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
