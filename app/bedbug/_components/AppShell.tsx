"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { UpdateChecker } from "./UpdateChecker";
import { useLargeText } from "../_hooks/useLargeText";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const [largeText] = useLargeText();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/bedbug-sw.js", { scope: "/bedbug/" })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cls = "bedbug-large-text";
    document.body.classList.toggle(cls, largeText);
    return () => {
      document.body.classList.remove(cls);
    };
  }, [largeText]);

  const version = process.env.NEXT_PUBLIC_BUILD_VERSION ?? "dev";

  return (
    <div className="bedbug-app min-h-screen bg-bedbug-cream text-bedbug-ink">
      <UpdateChecker />

      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 pt-4 text-sm sm:px-6">
        <Link
          href="/bedbug"
          aria-label="Home"
          className="text-bedbug-ink/70 underline-offset-4 hover:underline"
        >
          Home
        </Link>
        <Link
          href="/bedbug/bedroom"
          className="text-bedbug-ink/70 underline-offset-4 hover:underline"
          aria-label="Bedroom rules"
        >
          <span aria-hidden="true">🚪</span> Bedroom rules
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-8 sm:px-6">
        {children}
      </main>

      <div className="mx-auto w-full max-w-2xl px-4 pb-4 sm:px-6">
        <Link
          href="/bedbug/ask"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-bedbug-sage px-6 py-4 text-bedbug-button font-semibold text-bedbug-cream shadow-sm transition-[filter] hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-bedbug-sage/40"
        >
          <span aria-hidden="true">💬</span>
          <span>Ask Ben here</span>
        </Link>
        <p className="mt-2 text-center text-sm text-bedbug-ink/60">
          Type a question and I&apos;ll answer right on this site.
        </p>
      </div>

      <footer className="mx-auto w-full max-w-2xl px-4 pb-6 text-center sm:px-6">
        <span
          className="font-mono text-[10px] text-bedbug-ink/30"
          aria-label={`Build version ${version}`}
        >
          v{version}
        </span>
      </footer>
    </div>
  );
}
