import { test, expect } from "@playwright/test";
import { callsMatching, clearMockCalls, getMockCalls, INTAKE_SECRET } from "./_helpers";

test.beforeEach(async ({ request }) => {
  await clearMockCalls(request);
});

test("rejects request with no auth header", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-outbound", {
    data: { body: "hello" },
  });
  expect(res.status()).toBe(401);
});

test("rejects request with wrong secret", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-outbound", {
    headers: { authorization: "Bearer wrong-secret" },
    data: { body: "hello" },
  });
  expect(res.status()).toBe(401);
});

test("rejects empty body", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-outbound", {
    headers: { authorization: `Bearer ${INTAKE_SECRET}` },
    data: { body: "   " },
  });
  expect(res.status()).toBe(400);
});

test("rejects non-JSON body", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-outbound", {
    headers: {
      authorization: `Bearer ${INTAKE_SECRET}`,
      "content-type": "text/plain",
    },
    data: "not json",
  });
  expect(res.status()).toBe(400);
});

test("gap mode: emails Mom via Resend with reply_to wired to issue number", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-outbound", {
    headers: { authorization: `Bearer ${INTAKE_SECRET}` },
    data: { body: "Yes, wash everything in **hot** water.", issue: 42 },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ channel: "email", to: "mom" });

  const calls = await getMockCalls(request);
  const emailCalls = callsMatching(calls, /^\/emails$/);
  expect(emailCalls.length).toBe(1);
  const sent = emailCalls[0].body as Record<string, unknown>;
  expect(sent.to).toEqual(["mom@test.example"]);
  // Subject is suffixed with the issue ref so the Postmark inbound webhook
  // can route replies back.
  expect(sent.subject).toMatch(/\[mom-bedbug #42\]/);
  // Reply-To uses the +N sub-addressing pattern.
  expect(sent.reply_to).toBe("bedbug+42@inbound.test.example");
  // Markdown stripped — no double-asterisks in the SMS text.
  expect(sent.text).not.toMatch(/\*\*/);
  expect(sent.text).toMatch(/hot water/);
});

test("originator=karl always emails Karl, never Mom", async ({ request }) => {
  const res = await request.post("/api/bedbug/sms-outbound", {
    headers: { authorization: `Bearer ${INTAKE_SECRET}` },
    data: { body: "admin check", originator: "karl", issue: 7 },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ channel: "email", to: "karl" });

  const calls = await getMockCalls(request);
  const emailCalls = callsMatching(calls, /^\/emails$/);
  expect(emailCalls.length).toBe(1);
  const sent = emailCalls[0].body as Record<string, unknown>;
  expect(sent.to).toEqual(["karl@test.example"]);
});

test("long body is truncated to SMS-safe length", async ({ request }) => {
  const body = "x".repeat(2000);
  const res = await request.post("/api/bedbug/sms-outbound", {
    headers: { authorization: `Bearer ${INTAKE_SECRET}` },
    data: { body, issue: 1 },
  });
  expect(res.status()).toBe(200);
  const calls = await getMockCalls(request);
  const sent = calls.find((c) => c.path === "/emails")?.body as Record<string, unknown>;
  expect((sent.text as string).length).toBeLessThanOrEqual(1500);
  expect((sent.text as string).endsWith("...")).toBe(true);
});
