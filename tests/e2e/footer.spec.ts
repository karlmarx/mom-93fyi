import { test, expect } from "@playwright/test";

// The SMS link is THE entry point to the whole auto-answer loop. If it
// disappears, vanishes off the footer, or loses its sms: href, Mom has no
// way in. Test it on the bedbug shell.

test("SMS link is present with a real sms: href and visible label", async ({ page }) => {
  await page.goto("/bedbug");
  const link = page.locator('a[href^="sms:"]');
  await expect(link, "no <a href='sms:...'> on /bedbug").toBeVisible();

  const href = await link.getAttribute("href");
  // Format: sms:+1XXXXXXXXXX  — at least 10 digits after the +.
  expect(href).toMatch(/^sms:\+\d{10,}$/);

  await expect(link).toContainText(/text/i);
});

test("SMS link is also present on a deep page", async ({ page }) => {
  // Footer should follow Mom around the app, not just live on the root.
  await page.goto("/bedbug/laundry");
  const link = page.locator('a[href^="sms:"]');
  await expect(link).toBeVisible();
});
