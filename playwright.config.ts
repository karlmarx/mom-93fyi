import { defineConfig, devices } from "@playwright/test";

const MOCK_PORT = 14001;
const APP_PORT = 3100;
const APP_URL = `http://127.0.0.1:${APP_PORT}`;
const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  // Mock server has shared state — keep tests serialized so call assertions
  // don't see crosstalk between specs.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: APP_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node tests/e2e/_mock-server.mjs",
      port: MOCK_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      // Use Next dev for now — production build picks up env at start time
      // but is slower (~30s build). Dev is fine for routes + page rendering.
      command: `npx next dev -p ${APP_PORT}`,
      port: APP_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        // Point all outbound APIs at the mock.
        TWILIO_API_BASE: MOCK_URL,
        RESEND_API_BASE: MOCK_URL,
        GITHUB_API_BASE: MOCK_URL,
        // Intake / shared secrets — kept in sync with tests/e2e/_helpers.ts.
        INTAKE_SECRET: "test-intake-secret",
        // Twilio
        TWILIO_AUTH_TOKEN: "test-twilio-auth-token",
        TWILIO_ACCOUNT_SID: "ACtest_account_sid",
        TWILIO_API_KEY_SID: "SKtest_api_key_sid",
        TWILIO_API_KEY_SECRET: "test-api-key-secret",
        TWILIO_FROM_NUMBER: "+15555550100",
        MOM_PHONE: "+15555550199",
        KARL_PHONE: "+15555550198",
        // Email
        MOM_EMAIL: "mom@test.example",
        KARL_EMAIL: "karl@test.example",
        RESEND_API_KEY: "test-resend-key",
        RESEND_FROM: "ben@test.example",
        // GitHub
        GITHUB_TOKEN_INTAKE: "test-gh-token",
        GITHUB_REPO: "karlmarx/mom-93fyi",
        // Postmark inbound
        POSTMARK_INBOUND_USER: "test-pm-user",
        POSTMARK_INBOUND_PASS: "test-pm-pass",
        POSTMARK_INBOUND_DOMAIN: "inbound.test.example",
        // Default to gap mode (email Mom); SMS_LIVE tests can be added if
        // we wire originator-specific suites later.
        SMS_LIVE: "false",
      },
    },
  ],
});
