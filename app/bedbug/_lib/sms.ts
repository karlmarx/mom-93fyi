// Builds tel: and sms: URLs that work across iOS and Android.
//
// iOS expects sms:+15551234567&body=...  (single &)
// Android expects sms:+15551234567?body=...
// Both accept the iOS form; this is the most reliable single shape in 2026.

export function smsHref(to: string, body: string): string {
  const number = encodeURIComponent(to);
  const encoded = encodeURIComponent(body);
  return `sms:${number}&body=${encoded}`;
}

export function telHref(to: string): string {
  return `tel:${to}`;
}
