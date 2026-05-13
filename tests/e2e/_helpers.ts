import type { APIRequestContext } from "@playwright/test";

// Mock server hardcoded to 14001 — kept in sync with playwright.config.ts
// and the webServer env vars there.
export const MOCK_URL = "http://127.0.0.1:14001";

// Test intake secret — kept in sync with playwright.config.ts webServer env.
export const INTAKE_SECRET = "test-intake-secret";
export const TWILIO_AUTH_TOKEN = "test-twilio-auth-token";
export const MOM_PHONE = "+15555550199";
export const KARL_PHONE = "+15555550198";

export type MockCall = {
  method: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body: unknown;
  ts: number;
};

export async function clearMockCalls(request: APIRequestContext): Promise<void> {
  const res = await request.delete(`${MOCK_URL}/__calls`);
  if (!res.ok()) {
    throw new Error(`Failed to clear mock calls: ${res.status()}`);
  }
}

export async function getMockCalls(request: APIRequestContext): Promise<MockCall[]> {
  const res = await request.get(`${MOCK_URL}/__calls`);
  if (!res.ok()) {
    throw new Error(`Failed to read mock calls: ${res.status()}`);
  }
  return (await res.json()) as MockCall[];
}

// Filter recorded calls down to ones whose path matches a regex.
export function callsMatching(calls: MockCall[], pathRe: RegExp): MockCall[] {
  return calls.filter((c) => pathRe.test(c.path));
}
