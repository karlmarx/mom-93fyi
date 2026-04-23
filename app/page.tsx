"use client";

import { motion } from "framer-motion";
import WorryCard from "@/components/WorryCard";
import AskBox from "@/components/AskBox";
import { worries } from "@/lib/worries";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header - trimmed */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold text-ink italic leading-tight mb-8">
            Mom,
          </h1>

          <div className="max-w-2xl font-body text-lg md:text-xl text-ink leading-relaxed space-y-4">
            <p>
              A little site for the things you ask me about. I wrote out the real answers so they&apos;re here when you need them.
            </p>
          </div>

          <div className="mt-8">
            <span className="signature">{"\u2014 Ben"}</span>
          </div>
        </motion.div>
      </header>

      {/* Divider */}
      <div className="max-w-sm mx-auto my-10 text-center">
        <span className="font-hand text-3xl text-rose">{"\u273f"}</span>
      </div>

      {/* Worry cards */}
      <section className="max-w-3xl mx-auto px-6 pb-8 space-y-8">
        {worries.map((worry, index) => (
          <WorryCard key={worry.id} worry={worry} index={index} />
        ))}
      </section>

      {/* Ask box */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <AskBox />
      </section>

      {/* Minimal footer */}
      <footer className="max-w-3xl mx-auto px-6 py-10 text-center border-t border-rose/20">
        <p className="font-hand text-xl text-ink-soft">mom.93.fyi</p>
      </footer>
    </div>
  );
}
