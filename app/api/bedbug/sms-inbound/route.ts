import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Twilio signs every webhook with HMAC-SHA1 over (URL + sorted form params).
// Validating this proves the request actually came from Twilio. See:
// https://www.twilio.com/docs/usage/webhooks/webhooks-security
function validateTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>,
): boolean {
  const sortedKeys = Object.keys(params).sort();
  const data = sortedKeys.reduce((acc, key) => acc + key + params[key], url);
  const expected = crypto
    .createHmac("sha1", authToken)
    .update(data)
    .digest("base64");
  if (expected.length !== signature.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8"),
    );
  } catch {
    return false;
  }
}

// Twilio webhook URL configured in Console may differ from request.url after
// proxies and rewrites — reconstruct from forwarded headers when possible.
function rebuildWebhookUrl(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("host") ?? new URL(req.url).host;
  const u = new URL(req.url);
  return `${proto}://${host}${u.pathname}${u.search}`;
}

export async function POST(req: NextRequest) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const momPhone = process.env.MOM_PHONE;
  const ghToken = process.env.GITHUB_TOKEN_INTAKE;
  const repo = process.env.GITHUB_REPO ?? "karlmarx/mom-93fyi";
  const signature = req.headers.get("x-twilio-signature");

  if (!authToken || !momPhone || !ghToken) {
    console.error("sms-inbound: missing required env vars");
    return new NextResponse("Server not configured", { status: 500 });
  }
  if (!signature) {
    return new NextResponse("Missing signature", { status: 401 });
  }

  // Twilio sends application/x-www-form-urlencoded
  const formData = await req.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    params[key] = String(value);
  }

  const url = rebuildWebhookUrl(req);
  if (!validateTwilioSignature(authToken, signature, url, params)) {
    return new NextResponse("Bad signature", { status: 403 });
  }

  const from = (params.From ?? "").trim();
  const body = (params.Body ?? "").trim();

  // Whitelist Mom's number only. Silent 200 OK on anything else so Twilio
  // doesn't retry — a 4xx would.
  if (from !== momPhone) {
    console.warn(`sms-inbound: dropping message from non-whitelisted ${from}`);
    return new NextResponse("", { status: 200 });
  }
  if (!body) {
    return new NextResponse("", { status: 200 });
  }

  // Open a GitHub issue with the question. The 'mom-question' label is the
  // gate the answer-mom workflow listens on.
  const truncated = body.length > 60 ? `${body.slice(0, 57)}…` : body;
  const title = `Mom asked: ${truncated}`;
  const issueBody = [
    `**From:** ${from}`,
    `**Received:** ${new Date().toISOString()}`,
    "",
    "---",
    "",
    body,
  ].join("\n");

  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${ghToken}`,
          "User-Agent": "mom-bedbug-sms-intake",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          title,
          body: issueBody,
          labels: ["mom-question"],
        }),
      },
    );
    if (!ghRes.ok) {
      const errBody = await ghRes.text();
      console.error(
        `sms-inbound: GitHub issue create failed ${ghRes.status}: ${errBody}`,
      );
    }
  } catch (err) {
    console.error("sms-inbound: GitHub issue create threw", err);
  }

  // Always 200 OK so Twilio doesn't retry. Empty TwiML response.
  return new NextResponse("", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
