"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Worry } from "@/lib/worries";
import { ExternalLink } from "lucide-react";

export default function WorryCard({
  worry,
  index,
}: {
  worry: Worry;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [stillWorried, setStillWorried] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="letter-paper p-8 md:p-10 relative"
    >
      <span className="font-hand text-sm text-rose uppercase tracking-wider">
        {worry.category}
      </span>

      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-2 mb-4 leading-tight">
        {worry.question}
      </h2>

      <div className="scribble-underline inline-block mb-6">
        <span className="font-hand text-2xl text-navy">the short answer</span>
      </div>

      <p className="text-lg md:text-xl text-ink leading-relaxed mb-6 font-body italic">
        {worry.shortAnswer}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="font-hand text-xl text-rose hover:text-navy transition-colors inline-flex items-center gap-2 pull-tab"
      >
        {expanded ? "\u2191 less" : "tell me more \u2193"}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-6 border-t border-rose/20">
              <p className="text-base md:text-lg text-ink-soft leading-relaxed font-body">
                {worry.fullAnswer}
              </p>

              {worry.actionLink && (
                <a
                  href={worry.actionLink.url}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-sage/20 border-2 border-sage text-navy font-display font-semibold hover:bg-sage hover:text-paper transition-all"
                >
                  {worry.actionLink.text}
                  <ExternalLink size={18} />
                </a>
              )}

              {worry.stillWorried && (
                <div className="mt-6">
                  <button
                    onClick={() => setStillWorried(!stillWorried)}
                    className="font-hand text-xl text-ink-soft hover:text-rose transition-colors"
                  >
                    {stillWorried ? "\u2191 ok" : "still worried? \u2192"}
                  </button>
                  <AnimatePresence>
                    {stillWorried && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 bg-rose-soft/30 border-l-4 border-rose">
                          <p className="font-body italic text-ink leading-relaxed">
                            {worry.stillWorried}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
