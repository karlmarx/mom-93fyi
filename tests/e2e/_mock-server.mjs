#!/usr/bin/env node
// Mock for the three outbound APIs the bedbug routes talk to: Twilio,
// Resend, and GitHub. Started by Playwright's webServer alongside the
// Next.js app, with the app's TWILIO_API_BASE / RESEND_API_BASE /
// GITHUB_API_BASE env vars pointing here so its outbound fetches land here
// instead of the real services.
//
// Records every incoming request in memory. Tests reset the log with
// DELETE /__calls and read it with GET /__calls to assert on side effects.

import http from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 14001);

/** @type {Array<{method:string,path:string,query:Record<string,string>,headers:Record<string,string>,body:unknown,ts:number}>} */
const calls = [];

function tryParseJson(s) {
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let buf = "";
    req.on("data", (chunk) => {
      buf += chunk;
    });
    req.on("end", () => resolve(buf));
  });
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function text(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain" });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const body = await readBody(req);
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  // Introspection endpoints — not recorded.
  if (url.pathname === "/__calls") {
    if (req.method === "GET") {
      return json(res, 200, calls);
    }
    if (req.method === "DELETE") {
      calls.length = 0;
      return text(res, 204, "");
    }
    return text(res, 405, "Method Not Allowed");
  }
  if (url.pathname === "/__health" && req.method === "GET") {
    return json(res, 200, { ok: true });
  }

  // Record every other request for later assertions.
  let parsedBody = tryParseJson(body);
  if (parsedBody === null && body) {
    // Twilio sends application/x-www-form-urlencoded
    try {
      const params = new URLSearchParams(body);
      const obj = {};
      for (const [k, v] of params.entries()) obj[k] = v;
      parsedBody = Object.keys(obj).length > 0 ? obj : body;
    } catch {
      parsedBody = body;
    }
  }
  calls.push({
    method: req.method ?? "",
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers: Object.fromEntries(
      Object.entries(req.headers).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(",") : (v ?? ""),
      ]),
    ),
    body: parsedBody,
    ts: Date.now(),
  });

  // ─── Twilio: send SMS ───────────────────────────────────────────────────
  // POST /2010-04-01/Accounts/{sid}/Messages.json
  if (
    /^\/2010-04-01\/Accounts\/[^/]+\/Messages\.json$/.test(url.pathname) &&
    req.method === "POST"
  ) {
    return json(res, 201, {
      sid: "SMtest_message_id",
      status: "queued",
      to: (parsedBody && typeof parsedBody === "object" && "To" in parsedBody) ? parsedBody.To : null,
    });
  }

  // ─── Resend: send email ─────────────────────────────────────────────────
  if (url.pathname === "/emails" && req.method === "POST") {
    return json(res, 200, { id: "test-email-id-" + Date.now() });
  }

  // ─── GitHub ─────────────────────────────────────────────────────────────
  // POST /repos/:owner/:repo/issues   (sms-inbound creates issues)
  if (
    /^\/repos\/[^/]+\/[^/]+\/issues$/.test(url.pathname) &&
    req.method === "POST"
  ) {
    return json(res, 201, {
      number: 42,
      id: 9999999,
      html_url: "https://github.com/test/test/issues/42",
    });
  }

  // POST /repos/:owner/:repo/issues/:num/comments
  if (
    /^\/repos\/[^/]+\/[^/]+\/issues\/\d+\/comments$/.test(url.pathname) &&
    req.method === "POST"
  ) {
    return json(res, 201, { id: 12345, body: parsedBody?.body ?? "" });
  }

  // POST /repos/:owner/:repo/issues/:num/labels
  if (
    /^\/repos\/[^/]+\/[^/]+\/issues\/\d+\/labels$/.test(url.pathname) &&
    req.method === "POST"
  ) {
    const labels = Array.isArray(parsedBody?.labels) ? parsedBody.labels : [];
    return json(
      res,
      200,
      labels.map((name) => ({ name })),
    );
  }

  // GET /repos/:owner/:repo/issues/:num — used by self-review etc., not a
  // route handler, but kept here so tests for adjacent code don't 404.
  if (
    /^\/repos\/[^/]+\/[^/]+\/issues\/\d+$/.test(url.pathname) &&
    req.method === "GET"
  ) {
    return json(res, 200, {
      number: 42,
      title: "Test issue",
      body: "Test\n---\nWhat about the encasement?",
      labels: [{ name: "mom-question" }],
    });
  }

  // GET /search/issues  (agent-bridge list-pending)
  if (url.pathname === "/search/issues" && req.method === "GET") {
    // Return one fake mom-question item the first time it's called for
    // mom-question label, empty otherwise. Tests can override by populating
    // the mock-control env var below.
    // Match the positive label only — the q string also contains
    // "-label:needs-human" (negative qualifier) which a naive regex hits first.
    const labelMatch = (url.searchParams.get("q") ?? "").match(/(?<!-)label:([\w-]+)/);
    const label = labelMatch?.[1] ?? "";
    if (label === "mom-question") {
      return json(res, 200, {
        items: [
          {
            number: 7,
            title: "Mom asked: test",
            body: "From: +1\nReceived: now\n\n---\n\nDo I need to wash the curtains too?",
          },
        ],
      });
    }
    return json(res, 200, { items: [] });
  }

  // Default — unhandled paths are still recorded above, then 404'd here.
  return text(res, 404, `Mock has no handler for ${req.method} ${url.pathname}`);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[mock] outbound mock server listening on http://127.0.0.1:${PORT}`);
});

// Graceful shutdown so Playwright's webServer cleanup is quick.
for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 500).unref();
  });
}
