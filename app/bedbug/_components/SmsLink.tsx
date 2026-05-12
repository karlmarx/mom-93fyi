// The SMS line Mom uses to ask questions. Auto-answer agent picks
// inbound up via /api/bedbug/sms-inbound; Ben gets a copy too.
//
// Hardcoded on purpose — the number is on the bedbug pages anyway,
// and printing it client-side from env would just push complexity
// without changing what's visible.
const SMS_NUMBER = "+18886016132";
const DISPLAY_NUMBER = "(888) 601-6132";

export const sms = {
  number: SMS_NUMBER,
  display: DISPLAY_NUMBER,
  href: `sms:${SMS_NUMBER}`,
};
