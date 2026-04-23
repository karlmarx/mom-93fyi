"use client";

import { motion } from "framer-motion";
import WorryCard from "@/components/WorryCard";
import { worries } from "@/lib/worries";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Letter-style heading */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-hand text-2xl text-rose mb-4">
            {"\u2014 to the best mom \u2014"}
          </p>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-ink italic leading-tight mb-6">
            Dear Mom,
          </h1>

          <div className="max-w-2xl mx-auto text-left font-body text-lg md:text-xl text-ink leading-relaxed space-y-4">
            <p>
              I put this little corner of the internet together for you because
              I know you worry. Not because you&apos;re anxious {"\u2014"}{" "}
              because you care.
            </p>
            <p>
              Whenever something&apos;s nagging at you {"\u2014"} your phone,
              the car, a strange text, a flight {"\u2014"} come here first.
              I&apos;ve written out the real answer, the way I&apos;d explain it
              if we were on the phone.
            </p>
            <p className="font-body italic">
              Most of the things you worry about never happen. And the ones that
              do? We figure them out together.
            </p>
          </div>

          <div className="mt-8">
            <span className="signature">{"\u2014 Karl"}</span>
          </div>
        </motion.div>
      </header>

      {/* Gentle divider */}
      <div className="max-w-sm mx-auto my-12 text-center">
        <span className="font-hand text-3xl text-rose">{"\u273f"}</span>
      </div>

      {/* Worry cards */}
      <section className="max-w-3xl mx-auto px-6 pb-16 space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-10"
        >
          <p className="font-hand text-2xl text-navy">the worries, one by one</p>
          <div className="font-display italic text-ink-soft mt-2">
            Tap any card to read the full answer
          </div>
        </motion.div>

        {worries.map((worry, index) => (
          <WorryCard key={worry.id} worry={worry} index={index} />
        ))}
      </section>

      {/* Closing letter */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="letter-paper p-10 md:p-14 text-center">
          <span className="font-hand text-2xl text-rose">p.s.</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold italic text-ink mt-4 mb-6">
            You did the hardest part.
          </h2>
          <div className="font-body text-lg text-ink-soft leading-relaxed max-w-xl mx-auto space-y-4">
            <p>
              You raised me. You survived loss. You moved across the country
              twice. You learned new things well past the age most people stop.
            </p>
            <p>
              Whatever you&apos;re worried about right now {"\u2014"} you&apos;ve
              already handled harder. Trust yourself. And when you can&apos;t,
              call me.
            </p>
          </div>
          <div className="mt-10 pt-8 border-t border-rose/20">
            <span className="signature text-4xl">{"\u2665 K"}</span>
          </div>
        </div>
      </section>

      <footer className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="font-hand text-xl text-ink-soft">mom.93.fyi</p>
        <p className="font-body text-sm text-ink-soft mt-2 italic">
          a tiny corner of the internet, just for you
        </p>
      </footer>
    </div>
  );
}
