import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your phone is okay · mom.93.fyi",
  robots: "noindex",
};

const whyWarm: string[] = [
  "Phones get warm when you use them. Warm is normal. It does not mean anything is broken.",
  "The apps that follow your location, like the Snapshot app for your insurance, run a little warm while they work. That warmth is the trade for your lower bill, and it is worth it.",
  "Your phone is smart. If it ever truly got too hot, it would simply turn itself off on its own to stay safe. It will not hurt itself, and it cannot hurt you.",
];

const dontSpend: string[] = [
  "Do not buy a new phone. Do not go to a repair store.",
  "This phone is less than a year old, so it is under warranty. That means if anything is ever truly wrong, Google fixes it for free. You would never pay a store a single dollar.",
];

const steps: { title: string; body: string }[] = [
  {
    title: "Open Settings",
    body: "It is the gray gear icon on your phone. Give it a tap.",
  },
  {
    title: "Tap Device health & support",
    body: "It is in the Settings list. You may have to scroll down a little to see it.",
  },
  {
    title: "Tap Tips & support, then Contact us",
    body: "Contact us is near the bottom of that screen.",
  },
  {
    title: "Tell it what is happening",
    body: "Type something simple, like: my phone gets a little warm when I use it. Then tap Next step.",
  },
  {
    title: "Tap Get a call",
    body: "Put in your phone number. A real person at Google calls you back. It is free, and they answer day and night.",
  },
];

const relax: string[] = [
  "Set the phone down. It is okay to walk away from it for a while. Nothing bad happens.",
  "Take ten slow breaths. In through your nose, out through your mouth. Let your shoulders drop.",
  "Go for a swim. You always feel better after the pool, and the phone will be right where you left it.",
  "Make a cup of tea and let the phone just sit there. It can wait for you.",
];

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
            Really, it is. It just gets a little warm when you use it, and that
            is completely normal. Here is what is going on, and how to get a
            real Google expert to call you and tell you the very same thing.
          </p>
        </header>

        {/* Why it gets warm */}
        <section className="letter-paper p-8 md:p-10 mb-8">
          <div className="scribble-underline inline-block mb-6">
            <span className="font-hand text-2xl text-navy">why it gets warm</span>
          </div>
          <ul className="space-y-5">
            {whyWarm.map((line, i) => (
              <li
                key={i}
                className="font-body text-lg text-ink leading-relaxed flex gap-3"
              >
                <span className="text-sage font-bold" aria-hidden="true">
                  &#10003;
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Don't spend money */}
        <section className="bg-navy text-paper rounded-2xl p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-5 leading-snug">
            First, please do not spend any money.
          </h2>
          <ul className="space-y-4">
            {dontSpend.map((line, i) => (
              <li
                key={i}
                className="font-body text-lg leading-relaxed text-paper/95"
              >
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* Sign in first */}
        <section className="bg-rose-soft/40 border-l-4 border-rose rounded-r-2xl p-6 md:p-8 mb-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink leading-snug mb-2">
            Before you start: sign in.
          </h2>
          <p className="font-body text-lg text-ink leading-relaxed">
            Make sure you are signed into your Google account on the phone
            first. If you need the password, it is in the email I sent you. Open
            your email and it is right there.
          </p>
        </section>

        {/* Steps */}
        <section className="mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight mb-3">
            Want a Google expert to call you?
          </h2>
          <p className="font-body text-lg text-ink-soft leading-relaxed mb-8">
            You can do this yourself, any time, day or night. It is free. Just
            follow these five steps on your phone. I also sent you a little
            video in your email that shows the whole thing.
          </p>

          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li
                key={i}
                className="bg-paper-aged rounded-2xl p-6 flex gap-5 items-start"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ochre text-paper font-display text-xl font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink leading-snug mb-1">
                    {step.title}
                  </h3>
                  <p className="font-body text-lg text-ink leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Speaker tip */}
        <section className="bg-sage-soft/50 border-2 border-sage rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-navy shrink-0"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M19 5a9 9 0 0 1 0 14" />
            </svg>
            <h2 className="font-display text-2xl font-bold text-ink leading-snug">
              When they call, do this one thing.
            </h2>
          </div>
          <p className="font-body text-lg text-ink leading-relaxed">
            Tap the <strong>speaker</strong> button, then set the phone down on
            the table and talk toward it. That keeps your cheek from pressing
            the screen and hanging up by accident. Last time the call dropped,
            that is all it was. Nothing was wrong.
          </p>
        </section>

        {/* Ways to relax */}
        <section className="letter-paper p-8 md:p-10 mb-12">
          <div className="scribble-underline inline-block mb-4">
            <span className="font-hand text-2xl text-navy">while you wait, take a breath</span>
          </div>
          <p className="font-body text-lg text-ink leading-relaxed mb-6">
            There is nothing to fix right now, so this is a good moment to relax.
            Pick whichever one of these sounds nice.
          </p>
          <ul className="space-y-4">
            {relax.map((line, i) => (
              <li
                key={i}
                className="font-body text-lg text-ink leading-relaxed flex gap-3"
              >
                <span className="text-rose" aria-hidden="true">
                  &#10084;
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Closing */}
        <section className="text-center mb-8">
          <p className="font-body text-lg md:text-xl text-ink leading-relaxed italic mb-6">
            That is the whole thing. Your phone is fine, and now you know
            exactly what to do whenever you want to double check. You never have
            to sit and worry, and you do not have to wait for anyone.
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
