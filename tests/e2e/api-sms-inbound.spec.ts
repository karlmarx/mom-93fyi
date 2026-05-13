import { test, expect } from "@playwright/test";
import crypto from "node:crypto";
import { callsMatching, clearMockCalls, getMockCalls, MOM_PHONE, TWILIO_AUTH_TOKEN } from "./_helpers";

// Mirrors the validateTwilioSignature function in the route: sort form keys
// alphabetically, concatenate (key + value) into the URL, HMAC-SHA1 with the
// auth token, base64.
function signTwilio(url: string, params: Record<string, string>): string {
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);
  return crypto.createHmac("sha1", TWILIO_AUTH_TOKEN).update(data).digest("base64");
}

// playwright.config.ts sets APP_PORT=3100 and binds 127.0.0.1.
const WEBHOOK_URL = "http://127.0.0.1:3100/api/bedbug/sms-inbound";

test.beforeEach(async ({ request }) => {
  await clearMockCalls(request);
});

test("rejects request with no x-twilio-signature header", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-inbound", {
    form: { From: MOM_PHONE, Body: "test" },
  });
  expect(res.status()).toBe(401);
});

test("rejects request with bad signature", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-inbound", {
    headers: { "x-twilio-signature": "definitely-not-a-real-signature" },
    form: { From: MOM_PHONE, Body: "test" },
  });
  expect(res.status()).toBe(403);
});

test("drops valid-signed messages from non-whitelisted numbers without creating issues", async ({ request }) => {
  const params = { From: "+15555550000", Body: "I am a scammer" };
  const sig = signTwilio(WEBHOOK_URL, params);
  const res = await request.post("/api/bedbug/sms-inbound", {
    headers: { "x-twilio-signature": sig },
    form: params,
  });
  expect(res.status()).toBe(200);
  const calls = await getMockCalls(request);
  expect(callsMatching(calls, /\/repos\/[^/]+\/[^/]+\/issues$/)).toEqual([]);
});

test("creates a mom-question issue for a valid SMS from MOM_PHONE", async ({ request }) => {
  const params = { From: MOM_PHONE, Body: "Do I need to wash the curtains?" };
  const sig = signTwilio(WEBHOOK_URL, params);
  const res = await request.post("/api/bedbug/sms-inbound", {
    headers: { "x-twilio-signature": sig },
    form: params,
  });
  expect(res.status()).toBe(200);

  const calls = await getMockCalls(request);
  const issueCreate = callsMatching(calls, /\/repos\/karlmarx\/mom-93fyi\/issues$/);
  expect(issueCreate.length).toBe(1);
  const sent = issueCreate[0].body as Record<string, unknown>;
  expect(sent.labels).toEqual(["mom-question"]);
  expect(sent.title).toMatch(/Mom asked:/);
  expect(sent.body).toContain(params.Body);
});

test("an empty Body is dropped silently", async ({ request }) => {
  const params = { From: MOM_PHONE, Body: "   " };
  const sig = signTwilio(WEBHOOK_URL, params);
  const res = await request.post("/api/bedbug/sms-inbound", {
    headers: { "x-twilio-signature": sig },
    form: params,
  });
  expect(res.status()).toBe(200);
  const calls = await getMockCalls(request);
  expect(callsMatching(calls, /\/repos\/[^/]+\/[^/]+\/issues$/)).toEqual([]);
});
