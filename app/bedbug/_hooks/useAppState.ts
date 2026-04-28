"use client";

import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_APP_STATE, type AppState } from "../_lib/types";

const KEY = "bedbug.appState.v1";

export function useAppState() {
  const [state, setState] = useLocalStorage<AppState>(KEY, DEFAULT_APP_STATE);

  function patch(p: Partial<AppState>) {
    setState((prev) => ({ ...prev, ...p }));
  }

  return { state, setState, patch };
}
