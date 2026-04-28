"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { PanicButton } from "./PanicButton";
import { useSettings } from "../_hooks/useSettings";

type Props = {
  children: ReactNode;
  hidePanic?: boolean;
};

export function AppShell({ children, hidePanic }: Props) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const onHome = pathname === "/bedbug";
  const onStuck = pathname === "/bedbug/stuck";
  const showPanic = !hidePanic && !onHome && !onStuck;

  useEffect(() => {
    document.body.classList.toggle("bedbug-large-text", !!settings.largeTextMode);
    return () => {
      document.body.classList.remove("bedbug-large-text");
    };
  }, [settings.largeTextMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/bedbug-sw.js", { scope: "/bedbug/" }).catch(() => {
      // service worker registration failures are non-fatal
    });
  }, []);

  return (
    <div className="bedbug-app min-h-screen bg-bedbug-cream text-bedbug-ink">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 pt-4 text-sm sm:px-6">
        <Link
          href="/bedbug"
          className="text-bedbug-ink/70 underline-offset-4 hover:underline"
          aria-label="Home"
        >
          Home
        </Link>
        <Link
          href="/bedbug/bedroom"
          className="text-bedbug-ink/70 underline-offset-4 hover:underline"
          aria-label="Bedroom rules"
        >
          Bedroom rules
        </Link>
      </header>

      <main className="mx-auto w-full max-w-xl px-4 py-6 pb-32 sm:px-6">{children}</main>

      {showPanic ? <PanicButton /> : null}
    </div>
  );
}
