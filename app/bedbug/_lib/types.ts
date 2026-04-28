export type AppState = {
  confirmedBedbugs: boolean;

  lastCheckInDate: string | null;
  lastCheckInResult: "all_clear" | "flagged" | null;

  laundryRunsCompleted: number;

  mattressDayCompleted: boolean;
  encasementOn: boolean;
  interceptorsPlaced: boolean;
  cleanZoneSetupDate: string | null;

  lastInterceptorCaptureDate: string | null;
};

export const DEFAULT_APP_STATE: AppState = {
  confirmedBedbugs: false,
  lastCheckInDate: null,
  lastCheckInResult: null,
  laundryRunsCompleted: 0,
  mattressDayCompleted: false,
  encasementOn: false,
  interceptorsPlaced: false,
  cleanZoneSetupDate: null,
  lastInterceptorCaptureDate: null,
};

export type Settings = {
  confirmedBedbugs: boolean;
  largeTextMode: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  confirmedBedbugs: false,
  largeTextMode: false,
};
