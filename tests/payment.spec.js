const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test('Mock Interview payment flow', async ({ page }) => {

  // ── Step 1: Login ────────────────────────────────────────────────
  await page.goto('/login');
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: /Candidate/i }).click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: /Login via Password/i }).click();
  await page.waitForTimeout(500);

  await page.getByPlaceholder('Enter your email address').fill('babum73392@gmail.com');
  await page.getByPlaceholder('Enter your password').fill('Babum@2003');
  await page.locator('button[type="submit"].submit-btn').click();
  await page.waitForTimeout(3000);
  await expect(page).not.toHaveURL('/login');

  // ── Step 2: Go to Pricing page ───────────────────────────────────
  await page.goto('/pricing');
  await page.waitForTimeout(3000);

  // ── Step 3: Click Yearly plan button ────────────────────────────
  await page.getByRole('button', { name: 'Get Yearly' }).click();
  await page.waitForTimeout(5000);

  // ── Step 4: Handle Razorpay iframe ──────────────────────────────
  const razorpayFrame = page.frameLocator('iframe').first();
  await razorpayFrame.locator('body').waitFor({ timeout: 15000 });
  await page.waitForTimeout(3000);

  // ── Step 5: Handle "Contact details" popup if appears ────────────
  const mobileInput = razorpayFrame.locator('input[placeholder="Mobile number"]');
  if (await mobileInput.isVisible()) {
    await mobileInput.fill('7339284804');
    await razorpayFrame.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(3000);
  }

  // ── Step 6: Switch to Cards tab ─────────────────────────────────
  await razorpayFrame.locator('label:has-text("Cards")').first().click({ force: true });
  await page.waitForTimeout(2000);

  // ── Step 7: Fill card details ────────────────────────────────────
  await razorpayFrame.locator('[placeholder="Card Number"]').fill('4854980604708430');
  await page.waitForTimeout(500);
  await razorpayFrame.locator('[placeholder="MM / YY"]').fill('1228');
  await page.waitForTimeout(500);
  await razorpayFrame.locator('[placeholder="CVV"]').fill('123');
  await page.waitForTimeout(500);

  // Name and email are optional — only fill if visible
  const nameField = razorpayFrame.locator('[placeholder="Enter name on card"]');
  if (await nameField.isVisible()) {
    await nameField.fill('Babu M');
    await page.waitForTimeout(500);
  }

  const emailField = razorpayFrame.locator('[placeholder="Enter Email"]');
  if (await emailField.isVisible()) {
    await emailField.fill('babum73392@gmail.com');
    await page.waitForTimeout(500);
  }

  // ── Step 8: Click Continue ───────────────────────────────────────
  await razorpayFrame.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(3000);

  // ── Step 9: Handle "Save card?" popup if appears ─────────────────
  const maybeLater = razorpayFrame.getByRole('button', { name: 'Maybe later' });
  if (await maybeLater.isVisible()) {
    await maybeLater.click();
    await page.waitForTimeout(2000);
  }

  // ── Step 10: Handle OTP ──────────────────────────────────────────
  await razorpayFrame.locator('input[placeholder*="OTP"], input[maxlength="6"]')
    .waitFor({ timeout: 30000 });
  await razorpayFrame.locator('input[placeholder*="OTP"], input[maxlength="6"]')
    .fill('1234');
  await page.waitForTimeout(1000);
  await razorpayFrame.getByRole('button', { name: /Submit|Verify|Proceed|Pay/i }).click();
  await page.waitForTimeout(8000);

  // ── Step 11: Verify success ───────────────────────────────────────
  await expect(page.locator('text=Payment successful')).toBeVisible({ timeout: 15000 });

});

test('Netbanking payment flow', async ({ page }) => {

  // ── Step 1: Login ────────────────────────────────────────────────
  await page.goto('/login');
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: /Candidate/i }).click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: /Login via Password/i }).click();
  await page.waitForTimeout(500);

  await page.getByPlaceholder('Enter your email address').fill('babum73392@gmail.com');
  await page.getByPlaceholder('Enter your password').fill('Babum@2003');
  await page.locator('button[type="submit"].submit-btn').click();
  await page.waitForTimeout(3000);
  await expect(page).not.toHaveURL('/login');

  // ── Step 2: Go to Pricing page ───────────────────────────────────
  await page.goto('/pricing');
  await page.waitForTimeout(3000);

  // ── Step 3: Click 1 Month plan ───────────────────────────────────
  await page.getByRole('button', { name: 'Get 1 Month' }).click();
  await page.waitForTimeout(5000);

  // ── Step 4: Handle Razorpay iframe ──────────────────────────────
  const razorpayFrame = page.frameLocator('iframe').first();
  await razorpayFrame.locator('body').waitFor({ timeout: 15000 });
  await page.waitForTimeout(3000);

  // ── Step 5: Handle "Contact details" popup if appears ────────────
  const mobileInput = razorpayFrame.locator('input[placeholder="Mobile number"]');
  if (await mobileInput.isVisible()) {
    await mobileInput.fill('7339284804');
    await razorpayFrame.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(3000);
  }

  // ── Step 6: Click Netbanking tab ─────────────────────────────────
  await razorpayFrame.locator('label:has-text("Netbanking")').first().click({ force: true });
  await page.waitForTimeout(2000);

  // ── Step 7: Select HDFC test bank ───────────────────────────────
  const bankSelect = razorpayFrame.locator('select');
  if (await bankSelect.isVisible()) {
    await bankSelect.selectOption({ label: /HDFC/i });
  } else {
    await razorpayFrame.locator('text=HDFC Bank').first().click();
  }
  await page.waitForTimeout(2000);

  // ── Step 8: Click Pay button ─────────────────────────────────────
  await razorpayFrame.getByRole('button', { name: /Pay/i }).first().click();
  await page.waitForTimeout(5000);

  // ── Step 9: Handle bank simulation page ─────────────────────────
  const successBtn = page.getByRole('button', { name: /Success/i });
  if (await successBtn.isVisible({ timeout: 10000 })) {
    await successBtn.click();
  }
  await page.waitForTimeout(8000);

  // ── Step 10: Verify success ───────────────────────────────────────
  await expect(page.locator('text=Payment successful')).toBeVisible({ timeout: 15000 });

});