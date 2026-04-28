"use client";

import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_SETTINGS, type Settings } from "../_lib/types";

const KEY = "bedbug.settings.v1";

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(KEY, DEFAULT_SETTINGS);

  function patch(p: Partial<Settings>) {
    setSettings((prev) => ({ ...prev, ...p }));
  }

  return { settings, setSettings, patch };
}
