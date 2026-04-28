"use client";

import Link from "next/link";

export function PanicButton() {
  return (
    <Link
      href="/bedbug/stuck"
      aria-label="I'm stuck. Open the help screen to call Karl."
      className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-bedbug-red px-5 py-4 text-bedbug-cream shadow-lg active:brightness-90 focus:outline-none focus:ring-4 focus:ring-bedbug-red/40"
      style={{ minHeight: 64 }}
    >
      <span className="text-lg font-semibold">I&apos;m stuck</span>
    </Link>
  );
}
