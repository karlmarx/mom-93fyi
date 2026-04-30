"use client";

import { useEffect, useRef } from "react";

const POLL_INTERVAL_MS = 5 * 60 * 1000;
const INITIAL_DELAY_MS = 2000;

// Polls /version on focus, on visibility change, and on a 5-minute interval.
// If the server's build version differs from the one baked into the bundle,
// hard-reload so Mom always lands on the latest deploy without having to
// know what "refresh" means.
export function UpdateChecker() {
  const reloadingRef = useRef(false);

  useEffect(() => {
    const baked = process.env.NEXT_PUBLIC_BUILD_VERSION ?? null;
    if (!baked) return;

    async function check() {
      if (reloadingRef.current) return;
      try {
        const res = await fetch("/version", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { version?: unknown };
        if (typeof data.version !== "string") return;
        if (data.version !== baked) {
          reloadingRef.current = true;
          window.location.reload();
        }
      } catch {
        // Network failures are fine — the next poll or focus will retry.
      }
    }

    const initial = window.setTimeout(check, INITIAL_DELAY_MS);
    const interval = window.setInterval(check, POLL_INTERVAL_MS);

    function onVisibility() {
      if (document.visibilityState === "visible") check();
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", check);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", check);
    };
  }, []);

  return null;
}
