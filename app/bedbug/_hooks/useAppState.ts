"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { todayISO, daysBetween } from "../_lib/dates";

export type CheckInResult = "all_clear" | "flagged";

export type AppState = {
  // Daily monitoring
  lastCheckInDate: string | null;
  lastCheckInResult: CheckInResult | null;

  // Laundry
  laundryRunsCompleted: number;

  // Mattress day (set on /bedbug/mattress-day completion)
  mattressDayCompleted: boolean;
  encasementOn: boolean; // SafeNest waterproof protector slipped on
  interceptorsPlaced: boolean;
  cleanZoneSetupDate: string | null;

  // Monitoring
  lastInterceptorCaptureDate: string | null;
};

const DEFAULTS: AppState = {
  lastCheckInDate: null,
  lastCheckInResult: null,
  laundryRunsCompleted: 0,
  mattressDayCompleted: false,
  encasementOn: false,
  interceptorsPlaced: false,
  cleanZoneSetupDate: null,
  lastInterceptorCaptureDate: null,
};

const KEY = "bedbug.appState";

export function useAppState(): [
  AppState,
  (patch: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => void,
] {
  const [state, setState] = useLocalStorage<AppState>(KEY, DEFAULTS);

  const update = useCallback(
    (patch: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
      setState((prev) => {
        const merged = { ...DEFAULTS, ...prev };
        const p = typeof patch === "function" ? patch(merged) : patch;
        return { ...merged, ...p };
      });
    },
    [setState],
  );

  return [{ ...DEFAULTS, ...state }, update];
}

export type Stats = {
  loadsDone: number;
  daysInCleanZone: number;
  daysSinceLastCapture: number;
  hasCaptures: boolean;
};

export function computeStats(state: AppState, today: string = todayISO()): Stats {
  const loadsDone = state.laundryRunsCompleted;
  const daysInCleanZone = state.cleanZoneSetupDate
    ? daysBetween(state.cleanZoneSetupDate, today)
    : 0;
  const daysSinceLastCapture = state.lastInterceptorCaptureDate
    ? daysBetween(state.lastInterceptorCaptureDate, today)
    : daysInCleanZone;
  return {
    loadsDone,
    daysInCleanZone,
    daysSinceLastCapture,
    hasCaptures: state.lastInterceptorCaptureDate !== null,
  };
}
