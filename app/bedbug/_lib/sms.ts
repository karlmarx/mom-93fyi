export function smsHref(phone: string, body: string): string {
  const encoded = encodeURIComponent(body);
  return `sms:${phone}?&body=${encoded}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
