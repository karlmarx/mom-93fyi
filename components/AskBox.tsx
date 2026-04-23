"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function AskBox() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
    window.open(url, "_blank");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="letter-paper p-8 md:p-10 mt-12"
    >
      <span className="font-hand text-sm text-rose uppercase tracking-wider">
        Not here?
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-2 mb-4 leading-tight">
        Ask anything.
      </h2>
      <p className="text-lg text-ink-soft font-body italic mb-6">
        Type your question and I&apos;ll send it to Google for you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you wondering?"
          className="flex-1 px-5 py-4 bg-paper border-b-2 border-ink/20 focus:border-rose outline-none font-body text-lg text-ink"
        />
        <button
          type="submit"
          className="px-6 py-4 bg-navy text-paper font-display font-semibold hover:bg-rose transition-colors inline-flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Search
        </button>
      </form>
    </motion.section>
  );
}
