// Single config for the bed bug PWA. Anything that might change between
// environments (phone numbers, audio URL) reads from VITE/NEXT env vars when
// present; otherwise falls back to a placeholder.

const env = (key: string): string | undefined => {
  // Next.js exposes env vars prefixed with NEXT_PUBLIC_ to the client.
  // The spec was written for Vite (VITE_*); we accept both for parity.
  if (typeof process !== "undefined" && process.env) {
    return (
      process.env[`NEXT_PUBLIC_${key}`] ??
      (process.env[`VITE_${key}`] as string | undefined) ??
      undefined
    );
  }
  return undefined;
};

export const CONFIG = {
  PLAN_START_DATE: "2026-04-28", // Tuesday
  MATTRESS_DELIVERY_DATE: "2026-04-30", // Thursday
  KARL_PHONE: env("KARL_PHONE") ?? "+1XXXXXXXXXX",
  HELPER_PHONE: env("HELPER_PHONE") ?? "",
  REASSURANCE_AUDIO_URL: "/audio/karl-reassurance.mp3",
};
