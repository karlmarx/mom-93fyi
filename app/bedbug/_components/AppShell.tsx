"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useSettings } from "../_hooks/useSettings";
import { PanicButton } from "./PanicButton";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const [settings] = useSettings();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/bedbug-sw.js", { scope: "/bedbug/" })
      .catch(() => undefined);
  }, []);

  // Apply / remove the large-text body class. Bedbug-specific so it doesn't
  // affect the mom.93.fyi landing page if the user navigates back to it.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cls = "bedbug-large-text";
    if (settings.largeTextMode) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => {
      document.body.classList.remove(cls);
    };
  }, [settings.largeTextMode]);

  return (
    <div className="bedbug-app min-h-screen bg-bedbug-cream text-bedbug-ink">
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

      <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-32 sm:px-6">
        {children}
      </main>

      <PanicButton />
    </div>
  );
}
