import { test, expect } from "@playwright/test";
import { callsMatching, clearMockCalls, getMockCalls } from "./_helpers";

// Matches POSTMARK_INBOUND_USER / POSTMARK_INBOUND_PASS in playwright.config.ts
const PM_BASIC = "Basic " + Buffer.from("test-pm-user:test-pm-pass").toString("base64");

test.beforeEach(async ({ request }) => {
  await clearMockCalls(request);
});

test("rejects request without basic auth", async ({ request }) => {
  const res = await request.post("/api/bedbug/email-inbound", {
    data: { From: "karl@test.example", To: "bedbug+1@inbound.test.example", TextBody: "hi" },
  });
  expect(res.status()).toBe(401);
});

test("rejects request with wrong basic auth", async ({ request }) => {
  const res = await request.post("/api/bedbug/email-inbound", {
    headers: { authorization: "Basic " + Buffer.from("wrong:wrong").toString("base64") },
    data: { From: "karl@test.example", To: "bedbug+1@inbound.test.example", TextBody: "hi" },
  });
  expect(res.status()).toBe(401);
});

test("silently drops non-whitelisted senders without calling GitHub", async ({ request }) => {
  const res = await request.post("/api/bedbug/email-inbound", {
    headers: { authorization: PM_BASIC },
    data: {
      From: "stranger@evil.example",
      FromFull: { Email: "stranger@evil.example" },
      To: "bedbug+1@inbound.test.example",
      TextBody: "I am totally karl",
    },
  });
  // Silent 200 so Postmark doesn't retry, but no GitHub comment must be created.
  expect(res.status()).toBe(200);
  const calls = await getMockCalls(request);
  expect(callsMatching(calls, /\/issues\/\d+\/comments$/)).toEqual([]);
});

test("drops mail with no extractable issue number (no comment posted)", async ({ request }) => {
  const res = await request.post("/api/bedbug/email-inbound", {
    headers: { authorization: PM_BASIC },
    data: {
      From: "karl@test.example",
      FromFull: { Email: "karl@test.example" },
      To: "bedbug@inbound.test.example", // no +N
      Subject: "no ref here",
      TextBody: "hello",
    },
  });
  expect(res.status()).toBe(200);
  const calls = await getMockCalls(request);
  expect(callsMatching(calls, /\/issues\/\d+\/comments$/)).toEqual([]);
});

test("posts a GitHub comment when To has bedbug+N@... and sender is whitelisted", async ({ request }) => {
  const res = await request.post("/api/bedbug/email-inbound", {
    headers: { authorization: PM_BASIC },
    data: {
      From: "karl@test.example",
      FromFull: { Email: "karl@test.example" },
      To: "bedbug+42@inbound.test.example",
      Subject: "Re: From Ben [mom-bedbug #42]",
      TextBody: "Quoted body here ...",
      StrippedTextReply: "Yes — wash on hot.",
    },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ ok: true, issue: 42 });

  const calls = await getMockCalls(request);
  const commentCalls = callsMatching(calls, /\/repos\/karlmarx\/mom-93fyi\/issues\/42\/comments$/);
  expect(commentCalls.length).toBe(1);
  expect((commentCalls[0].body as Record<string, unknown>).body).toBe("Yes — wash on hot.");
});

test("falls back to issue number in subject when To has no +N", async ({ request }) => {
  const res = await request.post("/api/bedbug/email-inbound", {
    headers: { authorization: PM_BASIC },
    data: {
      From: "karl@test.example",
      FromFull: { Email: "karl@test.example" },
      To: "bedbug@inbound.test.example",
      Subject: "Re: From Ben [mom-bedbug #99]",
      TextBody: "ok",
      StrippedTextReply: "got it",
    },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ ok: true, issue: 99 });
});
