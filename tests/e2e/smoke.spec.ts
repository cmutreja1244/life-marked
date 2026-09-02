import { expect, test } from "@playwright/test";

test("marketing homepage renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /every life/i })).toBeVisible();
});

test("Margaret memorial and QR destination render", async ({ page }) => {
  await page.goto("/m/margaret-campbell");
  await expect(page.getByRole("heading", { name: /Margaret Eleanor Campbell/i })).toBeVisible();
  await page.goto("/q/MARGCAMP01");
  await expect(page.getByRole("heading", { name: /Margaret Eleanor Campbell/i })).toBeVisible();
});

test("unknown and private-style tokens share the memorial 404", async ({ page }) => {
  const unknown = await page.goto("/q/ZZZZZZZZZZ");
  expect(unknown?.status()).toBe(404);
  await expect(page).toHaveTitle(/Memorial/);
});

test("pilot page still links to Margaret", async ({ page }) => {
  await page.goto("/partners/pilot");
  await expect(page.getByRole("link", { name: /example memorial/i }).first()).toBeVisible();
});
