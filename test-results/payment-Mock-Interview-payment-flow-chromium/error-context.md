# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment.spec.js >> Mock Interview payment flow
- Location: tests\payment.spec.js:5:1

# Error details

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.setTimeout(120000);
  4   | 
  5   | test('Mock Interview payment flow', async ({ page }) => {
  6   | 
  7   |   // ── Step 1: Login ────────────────────────────────────────────────
  8   |   await page.goto('/login');
  9   |   await page.waitForTimeout(1000);
  10  | 
  11  |   await page.getByRole('button', { name: /Candidate/i }).click();
  12  |   await page.waitForTimeout(500);
  13  | 
  14  |   await page.getByRole('button', { name: /Login via Password/i }).click();
  15  |   await page.waitForTimeout(500);
  16  | 
  17  |   await page.getByPlaceholder('Enter your email address').fill('babum73392@gmail.com');
  18  |   await page.getByPlaceholder('Enter your password').fill('Babum@2003');
  19  |   await page.locator('button[type="submit"].submit-btn').click();
  20  |   await page.waitForTimeout(3000);
  21  |   await expect(page).not.toHaveURL('/login');
  22  | 
  23  |   // ── Step 2: Go to Pricing page ───────────────────────────────────
  24  |   await page.goto('/pricing');
  25  |   await page.waitForTimeout(3000);
  26  | 
  27  |   // ── Step 3: Click Yearly plan button ────────────────────────────
  28  |   await page.getByRole('button', { name: 'Get Yearly' }).click();
  29  |   await page.waitForTimeout(5000);
  30  | 
  31  |   // ── Step 4: Handle Razorpay iframe ──────────────────────────────
  32  |   const razorpayFrame = page.frameLocator('iframe').first();
  33  |   await razorpayFrame.locator('body').waitFor({ timeout: 15000 });
  34  |   await page.waitForTimeout(3000);
  35  | 
  36  |   // ── Step 5: Handle "Contact details" popup if appears ────────────
  37  |   const mobileInput = razorpayFrame.locator('input[placeholder="Mobile number"]');
  38  |   if (await mobileInput.isVisible()) {
  39  |     await mobileInput.fill('7339284804');
  40  |     await razorpayFrame.getByRole('button', { name: 'Continue' }).click();
> 41  |     await page.waitForTimeout(3000);
      |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  42  |   }
  43  | 
  44  |   // ── Step 6: Switch to Cards tab ─────────────────────────────────
  45  |   await razorpayFrame.locator('label:has-text("Cards")').first().click({ force: true });
  46  |   await page.waitForTimeout(2000);
  47  | 
  48  |   // ── Step 7: Fill card details ────────────────────────────────────
  49  |   await razorpayFrame.locator('[placeholder="Card Number"]').fill('4854980604708430');
  50  |   await page.waitForTimeout(500);
  51  |   await razorpayFrame.locator('[placeholder="MM / YY"]').fill('1228');
  52  |   await page.waitForTimeout(500);
  53  |   await razorpayFrame.locator('[placeholder="CVV"]').fill('123');
  54  |   await page.waitForTimeout(500);
  55  | 
  56  |   // Name and email are optional — only fill if visible
  57  |   const nameField = razorpayFrame.locator('[placeholder="Enter name on card"]');
  58  |   if (await nameField.isVisible()) {
  59  |     await nameField.fill('Babu M');
  60  |     await page.waitForTimeout(500);
  61  |   }
  62  | 
  63  |   const emailField = razorpayFrame.locator('[placeholder="Enter Email"]');
  64  |   if (await emailField.isVisible()) {
  65  |     await emailField.fill('babum73392@gmail.com');
  66  |     await page.waitForTimeout(500);
  67  |   }
  68  | 
  69  |   // ── Step 8: Click Continue ───────────────────────────────────────
  70  |   await razorpayFrame.getByRole('button', { name: 'Continue' }).click();
  71  |   await page.waitForTimeout(3000);
  72  | 
  73  |   // ── Step 9: Handle "Save card?" popup if appears ─────────────────
  74  |   const maybeLater = razorpayFrame.getByRole('button', { name: 'Maybe later' });
  75  |   if (await maybeLater.isVisible()) {
  76  |     await maybeLater.click();
  77  |     await page.waitForTimeout(2000);
  78  |   }
  79  | 
  80  |   // ── Step 10: Handle OTP ──────────────────────────────────────────
  81  |   await razorpayFrame.locator('input[placeholder*="OTP"], input[maxlength="6"]')
  82  |     .waitFor({ timeout: 30000 });
  83  |   await razorpayFrame.locator('input[placeholder*="OTP"], input[maxlength="6"]')
  84  |     .fill('1234');
  85  |   await page.waitForTimeout(1000);
  86  |   await razorpayFrame.getByRole('button', { name: /Submit|Verify|Proceed|Pay/i }).click();
  87  |   await page.waitForTimeout(8000);
  88  | 
  89  |   // ── Step 11: Verify success ───────────────────────────────────────
  90  |   await expect(page.locator('text=Payment successful')).toBeVisible({ timeout: 15000 });
  91  | 
  92  | });
  93  | 
  94  | test('Netbanking payment flow', async ({ page }) => {
  95  | 
  96  |   // ── Step 1: Login ────────────────────────────────────────────────
  97  |   await page.goto('/login');
  98  |   await page.waitForTimeout(1000);
  99  | 
  100 |   await page.getByRole('button', { name: /Candidate/i }).click();
  101 |   await page.waitForTimeout(500);
  102 | 
  103 |   await page.getByRole('button', { name: /Login via Password/i }).click();
  104 |   await page.waitForTimeout(500);
  105 | 
  106 |   await page.getByPlaceholder('Enter your email address').fill('babum73392@gmail.com');
  107 |   await page.getByPlaceholder('Enter your password').fill('Babum@2003');
  108 |   await page.locator('button[type="submit"].submit-btn').click();
  109 |   await page.waitForTimeout(3000);
  110 |   await expect(page).not.toHaveURL('/login');
  111 | 
  112 |   // ── Step 2: Go to Pricing page ───────────────────────────────────
  113 |   await page.goto('/pricing');
  114 |   await page.waitForTimeout(3000);
  115 | 
  116 |   // ── Step 3: Click 1 Month plan ───────────────────────────────────
  117 |   await page.getByRole('button', { name: 'Get 1 Month' }).click();
  118 |   await page.waitForTimeout(5000);
  119 | 
  120 |   // ── Step 4: Handle Razorpay iframe ──────────────────────────────
  121 |   const razorpayFrame = page.frameLocator('iframe').first();
  122 |   await razorpayFrame.locator('body').waitFor({ timeout: 15000 });
  123 |   await page.waitForTimeout(3000);
  124 | 
  125 |   // ── Step 5: Handle "Contact details" popup if appears ────────────
  126 |   const mobileInput = razorpayFrame.locator('input[placeholder="Mobile number"]');
  127 |   if (await mobileInput.isVisible()) {
  128 |     await mobileInput.fill('7339284804');
  129 |     await razorpayFrame.getByRole('button', { name: 'Continue' }).click();
  130 |     await page.waitForTimeout(3000);
  131 |   }
  132 | 
  133 |   // ── Step 6: Click Netbanking tab ─────────────────────────────────
  134 |   await razorpayFrame.locator('label:has-text("Netbanking")').first().click({ force: true });
  135 |   await page.waitForTimeout(2000);
  136 | 
  137 |   // ── Step 7: Select HDFC test bank ───────────────────────────────
  138 |   const bankSelect = razorpayFrame.locator('select');
  139 |   if (await bankSelect.isVisible()) {
  140 |     await bankSelect.selectOption({ label: /HDFC/i });
  141 |   } else {
```