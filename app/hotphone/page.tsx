import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your phone is okay · mom.93.fyi",
  robots: "noindex",
};

const GETHELP = "https://support.google.com/pixelphone/gethelp";

const whyWarm: string[] = [
  "Phones get warm when you use them. Warm is normal. It does not mean anything is broken.",
  "The apps that follow your location, like the Snapshot app for your insurance, run a little warm while they work. That warmth is the trade for your lower bill, and it is worth it.",
  "Your phone is smart. If it ever truly got too hot, it would simply turn itself off on its own to stay safe. It will not hurt itself, and it cannot hurt you.",
];

const hotspot: string[] = [
  "It makes the phone a little warmer, because the phone is doing more work. That is normal.",
  "It uses more battery, so you may need to charge a little more often.",
  "It uses your cell data instead of home internet. Your plan includes the hotspot, so it does not cost you extra.",
];

const dontSpend: string[] = [
  "Do not buy a new phone. Do not go to a repair store.",
  "This phone is less than a year old, so it is under warranty. That means if anything is ever truly wrong, Google fixes it for free. You would never pay a store a single dollar.",
];

type Step = {
  n: number;
  banner: string;
  caption: string;
  img?: string;
  kind?: "button" | "sage";
};

const steps: Step[] = [
  {
    n: 1,
    banner: "Tap the button below to open Google.",
    caption: "If it asks who you are, sign in. Your password is in the email I sent you.",
    kind: "button",
  },
  {
    n: 2,
    banner: "Type these two words: hot phone",
    caption: "Tap the box under What can we help with, then type the two words. Lowercase is fine.",
    img: "/hotphone/step-2.jpg",
  },
  {
    n: 3,
    banner: "Tap Device is warm, then tap Next step.",
    caption: "Device is warm turns blue when you tap it. That is how you know it worked.",
    img: "/hotphone/step-3.jpg",
  },
  {
    n: 4,
    banner: "Tap Next step again.",
    caption: "A list of articles shows up first. You do not read them. Just tap Next step.",
    img: "/hotphone/step-4.jpg",
  },
  {
    n: 5,
    banner: "Tap the Get a call card.",
    caption: "It is the one that says less than 1 min wait. The other one is Chat. You want Get a call.",
    img: "/hotphone/step-5.jpg",
  },
  {
    n: 6,
    banner: "Type your phone number in the box.",
    caption: "Your name is already filled in. You only add your number.",
    img: "/hotphone/step-6.jpg",
  },
  {
    n: 7,
    banner: "Tap the small box, then tap Next.",
    caption: "Tapping the box puts a check in it. Then tap Next, and Google calls you.",
    img: "/hotphone/step-7.jpg",
  },
  {
    n: 8,
    banner: "When it rings, tap Speaker and set the phone on the table.",
    caption:
      "Google calls you within a minute. Tap Speaker, lay the phone flat, and talk toward it. That keeps your cheek off the screen so the call does not hang up by accident. That is the only thing that happened last time.",
    kind: "sage",
  },
];

const relax: string[] = [
  "Set the phone down and walk away from it for a while. Nothing happens to it.",
  "Step outside or sit on the porch for a few minutes.",
  "Go for a swim. The phone will be right where you left it.",
  "Make a cup of tea and let the phone sit there.",
];

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-ochre text-paper font-display text-2xl font-bold" style={{ height: 52, width: 52 }}>
      {n}
    </span>
  );
}

function VideoCard({ label, sub }: { label: string; sub?: string }) {
  return (
    <figure className="bg-paper-aged rounded-2xl p-4 shadow-sm">
      <video
        className="w-full rounded-xl block"
        controls
        muted
        preload="none"
        poster="/hotphone/poster.jpg"
      >
        <source src="/hotphone/walkthrough.mp4" type="video/mp4" />
      </video>
      <figcaption className="text-center mt-3">
        <span className="font-hand text-2xl text-rose">{label}</span>
        {sub && <span className="block font-body text-base text-ink-soft mt-1">{sub}</span>}
      </figcaption>
    </figure>
  );
}

export default function HotPhonePage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-6 pt-16 pb-8">
        {/* Hero */}
        <header className="mb-12">
          <span className="font-hand text-base text-rose uppercase tracking-wider">
            A quick guide for you
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold italic text-ink leading-tight mt-2 mb-6">
            Your phone is okay.
          </h1>
          <p className="font-body text-lg md:text-xl text-ink leading-relaxed">
            It just gets a little warm when you use it, which is normal. It is
            under warranty, so if anything were ever truly wrong, Google would
            fix it for free. You do not need a new phone, and you do not need a
            repair store. The pictures below show you how to get a Google expert
            to call you and tell you the same thing. You cannot break anything by
            following them.
          </p>
        </header>

        {/* Why it gets warm */}
        <section className="letter-paper p-8 md:p-10 mb-8">
          <div className="scribble-underline inline-block mb-6">
            <span className="font-hand text-2xl text-navy">why it gets warm</span>
          </div>
          <ul className="space-y-5">
            {whyWarm.map((line, i) => (
              <li key={i} className="font-body text-lg text-ink leading-relaxed flex gap-3">
                <span className="text-sage font-bold" aria-hidden="true">&#10003;</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Hotspot */}
        <section className="letter-paper p-8 md:p-10 mb-8">
          <div className="scribble-underline inline-block mb-4">
            <span className="font-hand text-2xl text-navy">about your hotspot</span>
          </div>
          <p className="font-body text-lg text-ink leading-relaxed mb-5">
            You use your hotspot every day, and that is fine. It is safe, and you
            can keep using it. Here is the trade, so you know what is happening.
          </p>
          <ul className="space-y-4 mb-5">
            {hotspot.map((line, i) => (
              <li key={i} className="font-body text-lg text-ink leading-relaxed flex gap-3">
                <span className="text-ochre font-bold" aria-hidden="true">&bull;</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="font-body text-lg text-ink leading-relaxed">
            None of that can hurt the phone. If it ever feels too warm, take it
            off the charger and keep it out of the sun. The phone also turns
            itself off on its own if it ever got too hot, so it cannot harm
            itself.
          </p>
        </section>

        {/* Don't spend money */}
        <section className="bg-navy text-paper rounded-2xl p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-5 leading-snug">
            First, please do not spend any money.
          </h2>
          <ul className="space-y-4">
            {dontSpend.map((line, i) => (
              <li key={i} className="font-body text-lg leading-relaxed text-paper/95">{line}</li>
            ))}
          </ul>
        </section>

        {/* Sign in first */}
        <section className="bg-rose-soft/40 border-l-4 border-rose rounded-r-2xl p-6 md:p-8 mb-12">
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink leading-snug mb-2">
            Before you start: sign in.
          </h2>
          <p className="font-body text-lg text-ink leading-relaxed">
            Make sure you are signed into your Google account on the phone
            first. If you need the password, it is in the email I sent you. Open
            your email and it is right there.
          </p>
        </section>

        {/* Walkthrough */}
        <section className="mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight mb-3">
            Want a Google expert to call you?
          </h2>
          <p className="font-body text-lg text-ink-soft leading-relaxed mb-8">
            There is nothing wrong with your phone. These steps just get a real
            person at Google to call you, for free, and they answer day and
            night. Follow the pictures one at a time.
          </p>

          {/* Video preview (top) */}
          <div className="mb-10">
            <VideoCard
              label="watch the whole thing first if you like"
              sub="This same video is in the email I sent you, in case you would rather watch it there."
            />
          </div>

          {/* Steps */}
          <ol className="mx-auto max-w-md space-y-6">
            {steps.map((step) => (
              <li key={step.n} className="bg-paper-aged rounded-2xl overflow-hidden shadow-sm">
                {/* banner bar */}
                <div className="bg-navy text-paper flex items-center gap-4 px-5 py-4">
                  <NumberBadge n={step.n} />
                  <span className="font-display font-bold text-lg leading-snug">{step.banner}</span>
                </div>

                {step.caption && (
                  <p className="font-body text-base text-ink leading-relaxed px-5 pt-4 pb-1">
                    {step.caption}
                  </p>
                )}

                {step.img && (
                  <div className="p-4">
                    <img
                      src={step.img}
                      alt={`Step ${step.n}: ${step.banner}`}
                      className="w-full block rounded-xl border border-ink/10"
                    />
                  </div>
                )}

                {step.kind === "button" && (
                  <div className="p-6 pt-4">
                    <a
                      href={GETHELP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full rounded-2xl bg-rose text-paper font-display text-xl font-bold px-6 py-5 hover:bg-navy transition-colors"
                      style={{ minHeight: 64 }}
                    >
                      Open Google support
                    </a>
                  </div>
                )}

                {step.kind === "sage" && (
                  <div className="m-4 mt-4 bg-sage-soft/50 border-2 border-sage rounded-xl p-5 flex gap-4 items-start">
                    <svg
                      width="32" height="32" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="text-navy shrink-0 mt-1" aria-hidden="true"
                    >
                      <path d="M11 5 6 9H2v6h4l5 4z" />
                      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                      <path d="M19 5a9 9 0 0 1 0 14" />
                    </svg>
                    <p className="font-body text-base text-ink leading-relaxed">
                      Tap the <strong>speaker</strong> button, set the phone on
                      the table, and talk toward it. That keeps your cheek off
                      the screen so the call does not hang up by accident.
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Video again (bottom safety net) */}
        <section className="mx-auto max-w-md mb-12">
          <VideoCard label="watch the whole thing again" />
        </section>

        {/* Ways to relax */}
        <section className="letter-paper p-8 md:p-10 mb-12">
          <div className="scribble-underline inline-block mb-4">
            <span className="font-hand text-2xl text-navy">while you wait</span>
          </div>
          <p className="font-body text-lg text-ink leading-relaxed mb-6">
            There is nothing to fix right now. If you want to put the phone down
            for a bit, here are a few ideas.
          </p>
          <ul className="space-y-4">
            {relax.map((line, i) => (
              <li key={i} className="font-body text-lg text-ink leading-relaxed flex gap-3">
                <span className="text-rose" aria-hidden="true">&#10084;</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Closing */}
        <section className="text-center mb-8">
          <p className="font-body text-lg md:text-xl text-ink leading-relaxed italic mb-6">
            That is the whole thing. The phone is fine, and now you know how to
            get Google to check it any time you want.
          </p>
          <span className="signature">your son&apos;s AI</span>
        </section>

        <footer className="pt-8 text-center border-t border-rose/20">
          <a href="/" className="font-hand text-xl text-ink-soft hover:text-rose transition-colors">
            back to mom.93.fyi
          </a>
        </footer>
      </main>
    </div>
  );
}
