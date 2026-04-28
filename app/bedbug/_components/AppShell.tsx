"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/bedbug-sw.js", { scope: "/bedbug/" })
      .catch(() => undefined);
  }, []);

  return (
    <div className="bedbug-app min-h-screen bg-bedbug-cream text-bedbug-ink">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 pt-4 text-sm sm:px-6">
        <Link href="/bedbug" aria-label="Home" className="text-bedbug-ink/70 underline-offset-4 hover:underline">
          Home
        </Link>
        <Link
          href="/bedbug/rules"
          className="text-bedbug-ink/70 underline-offset-4 hover:underline"
          aria-label="The 5 rules"
        >
          The 5 rules
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-24 sm:px-6">{children}</main>
    </div>
  );
}
