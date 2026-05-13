import { test, expect } from "@playwright/test";
import { callsMatching, clearMockCalls, getMockCalls, INTAKE_SECRET } from "./_helpers";

const AUTH = { authorization: `Bearer ${INTAKE_SECRET}` };

test.beforeEach(async ({ request }) => {
  await clearMockCalls(request);
});

test("GET without auth → 401", async ({ request }) => {
  const res = await request.get("/api/bedbug/agent-bridge?action=list-pending");
  expect(res.status()).toBe(401);
});

test("GET with unknown action → 400", async ({ request }) => {
  const res = await request.get("/api/bedbug/agent-bridge?action=nope", { headers: AUTH });
  expect(res.status()).toBe(400);
});

test("GET list-pending hits GitHub /search/issues once per label and aggregates results", async ({ request }) => {
  const res = await request.get("/api/bedbug/agent-bridge?action=list-pending", { headers: AUTH });
  expect(res.status()).toBe(200);
  const json = (await res.json()) as { issues: Array<{ originator: string; issue_number: number }> };
  // Mock returns one mom-question item; the karl-question search returns empty.
  expect(json.issues.length).toBe(1);
  expect(json.issues[0]).toMatchObject({ originator: "mom", issue_number: 7 });

  const calls = await getMockCalls(request);
  const searches = callsMatching(calls, /^\/search\/issues$/);
  expect(searches.length).toBe(2); // one per label
});

test("POST without auth → 401", async ({ request }) => {
  const res = await request.post("/api/bedbug/agent-bridge", {
    data: { action: "answer", issue: 1, body: "hi" },
  });
  expect(res.status()).toBe(401);
});

test("POST with malformed JSON → 400", async ({ request }) => {
  const res = await request.post("/api/bedbug/agent-bridge", {
    headers: { ...AUTH, "content-type": "application/json" },
    data: "not json at all",
  });
  expect(res.status()).toBe(400);
});

test("POST missing issue → 400", async ({ request }) => {
  const res = await request.post("/api/bedbug/agent-bridge", {
    headers: AUTH,
    data: { action: "answer", body: "hi" },
  });
  expect(res.status()).toBe(400);
});

test("POST action=answer missing body → 400", async ({ request }) => {
  const res = await request.post("/api/bedbug/agent-bridge", {
    headers: AUTH,
    data: { action: "answer", issue: 1 },
  });
  expect(res.status()).toBe(400);
});

test("POST action=answer happy path posts a GitHub comment", async ({ request }) => {
  const res = await request.post("/api/bedbug/agent-bridge", {
    headers: AUTH,
    data: { action: "answer", issue: 7, body: "Yes, hot water." },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ ok: true, action: "answered", issue: 7 });

  const calls = await getMockCalls(request);
  const comments = callsMatching(calls, /\/repos\/karlmarx\/mom-93fyi\/issues\/7\/comments$/);
  expect(comments.length).toBe(1);
  expect((comments[0].body as Record<string, unknown>).body).toBe("Yes, hot water.");
});

test("POST action=escalate adds needs-human label", async ({ request }) => {
  const res = await request.post("/api/bedbug/agent-bridge", {
    headers: AUTH,
    data: { action: "escalate", issue: 9 },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ ok: true, action: "escalated", issue: 9 });

  const calls = await getMockCalls(request);
  const labels = callsMatching(calls, /\/repos\/karlmarx\/mom-93fyi\/issues\/9\/labels$/);
  expect(labels.length).toBe(1);
  expect((labels[0].body as Record<string, unknown>).labels).toEqual(["needs-human"]);
});

test("POST unknown action → 400", async ({ request }) => {
  const res = await request.post("/api/bedbug/agent-bridge", {
    headers: AUTH,
    data: { action: "fly-to-moon", issue: 1 },
  });
  expect(res.status()).toBe(400);
});
