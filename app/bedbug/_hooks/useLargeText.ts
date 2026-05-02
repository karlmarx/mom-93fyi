"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "bedbug.largeText";

function read(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) onChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("bedbug:largeText", onChange as EventListener);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("bedbug:largeText", onChange as EventListener);
  };
}

export function useLargeText(): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(subscribe, read, () => false);

  const set = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
      window.dispatchEvent(new Event("bedbug:largeText"));
    } catch {
      // ignore
    }
  }, []);

  return [value, set];
}
