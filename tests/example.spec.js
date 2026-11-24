const { test, expect } = require('@playwright/test');

test('Homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vconnects/);
});

test('Jobs page loads', async ({ page }) => {
  await page.goto('/jobs');
  await expect(page.locator('.jobs-title')).toBeVisible();
});

test('Login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('form')).toBeVisible();
});