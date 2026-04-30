"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Settings = {
  // Karl flips this in /bedbug/settings once Section 0 photos confirm bed bugs.
  // false → home shows only the Section 0 photo-task card.
  confirmedBedbugs: boolean;
  largeTextMode: boolean;
};

const DEFAULTS: Settings = {
  confirmedBedbugs: false,
  largeTextMode: false,
};

const KEY = "bedbug.settings";

export function useSettings(): [
  Settings,
  (patch: Partial<Settings>) => void,
] {
  const [settings, setSettings] = useLocalStorage<Settings>(KEY, DEFAULTS);

  const update = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [setSettings],
  );

  return [{ ...DEFAULTS, ...settings }, update];
}
