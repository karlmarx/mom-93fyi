import { test, expect, type Page } from "@playwright/test";

// Routes Mom and Karl actually visit. Order doesn't matter, but listing them
// explicitly catches a 404 the moment a page is renamed without anyone
// updating the SMS link or app shell.
const BEDBUG_ROUTES = [
  "/bedbug",
  "/bedbug/items",
  "/bedbug/questions",
  "/bedbug/laundry",
  "/bedbug/mattress-day",
  "/bedbug/rules",
  "/bedbug/bedroom",
  "/bedbug/morning",
  "/bedbug/worried",
  "/bedbug/why",
  "/bedbug/timetable",
  "/bedbug/bites",
];

// Lines we treat as expected noise (font preload, third-party widget chatter).
// Anything not matched here will fail the test.
const CONSOLE_NOISE = [
  /Download the React DevTools/,
  /\[Fast Refresh\]/,
  /webpack-internal/,
  /preloaded with link preload/,
  /preloaded using link preload but not used/,
  // Next dev's HMR WebSocket fails through Playwright's webServer proxy.
  // Harmless in dev, doesn't exist in prod.
  /_next\/webpack-hmr/,
  /WebSocket connection to .* failed/,
];

function attachConsoleCapture(page: Page): { errors: string[] } {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (CONSOLE_NOISE.some((re) => re.test(text))) return;
    errors.push(text);
  });
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  return { errors };
}

for (const route of BEDBUG_ROUTES) {
  test(`page renders: ${route}`, async ({ page }) => {
    const { errors } = attachConsoleCapture(page);
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res, `no response for ${route}`).not.toBeNull();
    expect(res!.status(), `bad status for ${route}`).toBe(200);

    // Page renders meaningful content, not just an empty shell or error page.
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(30);
    // No "Application error" / Next error overlay text.
    expect(bodyText).not.toMatch(/Application error/i);
    expect(bodyText).not.toMatch(/Internal Server Error/i);

    // Give late hydration errors a beat to surface before asserting.
    await page.waitForLoadState("networkidle").catch(() => {});
    expect(errors, `console errors on ${route}`).toEqual([]);
  });
}

test("root /bedbug links to each section", async ({ page }) => {
  await page.goto("/bedbug");
  // The shell's nav should contain links to the major sections — sanity
  // check a representative few rather than every one.
  for (const target of ["/bedbug/items", "/bedbug/questions", "/bedbug/rules"]) {
    const link = page.locator(`a[href="${target}"]`).first();
    await expect(link, `no link to ${target} from /bedbug`).toBeAttached();
  }
});
