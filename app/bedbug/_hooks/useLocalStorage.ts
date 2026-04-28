"use client";

import { useCallback, useSyncExternalStore } from "react";

const cache = new Map<string, { version: number; value: unknown }>();
const versions = new Map<string, number>();
const listeners = new Map<string, Set<() => void>>();

function bump(key: string) {
  versions.set(key, (versions.get(key) ?? 0) + 1);
  cache.delete(key);
  listeners.get(key)?.forEach((fn) => fn());
}

function read<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  const cached = cache.get(key);
  const v = versions.get(key) ?? 0;
  if (cached && cached.version === v) return cached.value as T;

  let value: T;
  try {
    const raw = window.localStorage.getItem(key);
    value = raw === null ? initial : (JSON.parse(raw) as T);
  } catch {
    value = initial;
  }
  cache.set(key, { version: v, value });
  return value;
}

function subscribeToKey(key: string, listener: () => void): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);

  function onStorage(e: StorageEvent) {
    if (e.key === key || e.key === null) {
      cache.delete(key);
      listener();
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    set?.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (listener) => subscribeToKey(key, listener),
    () => read(key, initial),
    () => initial,
  );

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = read(key, initial);
      const nextValue =
        typeof next === "function" ? (next as (p: T) => T)(current) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch {
        // storage may be full or unavailable
      }
      bump(key);
    },
    [key, initial],
  );

  return [value, update];
}
