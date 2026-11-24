# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment.spec.js >> Netbanking payment flow
- Location: tests\payment.spec.js:94:1

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('iframe').first().contentFrame().locator('text=HDFC Bank').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "TConnects Logo" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "TConnects Logo" [ref=e7]
      - generic [ref=e8]:
        - generic [ref=e9]:
          - link "Home" [ref=e10] [cursor=pointer]:
            - /url: /
          - button "Find Work" [ref=e12] [cursor=pointer]:
            - generic [ref=e13]:
              - text: Find Work
              - img [ref=e14]
          - button "Learning" [ref=e17] [cursor=pointer]:
            - generic [ref=e18]:
              - text: Learning
              - img [ref=e19]
          - link "Subscriptions" [ref=e21] [cursor=pointer]:
            - /url: /pricing
        - generic [ref=e23] [cursor=pointer]:
          - generic [ref=e24]: B
          - generic [ref=e25]: Hi, babu
  - generic [ref=e26]:
    - heading "Simple, Transparent Pricing" [level=1] [ref=e27]
    - paragraph [ref=e28]: Pay once for what you need, or subscribe for unlimited access to power up your career.
  - generic [ref=e29]:
    - generic [ref=e30]:
      - generic [ref=e31]: ✅
      - generic [ref=e32]:
        - generic [ref=e33]: Monthly plan is active — expires 27 May 2026
        - generic [ref=e34]: 30 days remaining · Resume ✅ · Mock Interview ❌
    - heading "One-Time Purchases" [level=2] [ref=e35]
    - paragraph [ref=e36]: Pay per use — Buy again after each use or subscribe for unlimited access and save more.
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]: ONE-TIME ACCESS
        - generic [ref=e40]: 📄
        - generic [ref=e41]: Resume Builder
        - generic [ref=e42]: ₹99
        - generic [ref=e43]: Single use
        - list [ref=e44]:
          - listitem [ref=e45]:
            - generic [ref=e46]: ✓
            - generic [ref=e47]: AI-powered resume generation
          - listitem [ref=e48]:
            - generic [ref=e49]: ✓
            - generic [ref=e50]: Tailored to job description
          - listitem [ref=e51]:
            - generic [ref=e52]: ✓
            - generic [ref=e53]: ATS-optimised output
          - listitem [ref=e54]:
            - generic [ref=e55]: ✓
            - generic [ref=e56]: PDF download
          - listitem [ref=e57]:
            - generic [ref=e58]: ✓
            - generic [ref=e59]: Single use — repurchase to reuse
        - generic [ref=e60]: ✅ Covered by your active subscription
        - button "Included in plan" [disabled] [ref=e61]
      - generic [ref=e62]:
        - generic [ref=e63]: ONE-TIME ACCESS
        - generic [ref=e64]: 🎙️
        - generic [ref=e65]: Mock Interview
        - generic [ref=e66]: ₹3,499
        - generic [ref=e67]: Single session
        - list [ref=e68]:
          - listitem [ref=e69]:
            - generic [ref=e70]: ✓
            - generic [ref=e71]: 1-on-1 with industry expert
          - listitem [ref=e72]:
            - generic [ref=e73]: ✓
            - generic [ref=e74]: Real interview scenarios
          - listitem [ref=e75]:
            - generic [ref=e76]: ✓
            - generic [ref=e77]: Detailed feedback report
          - listitem [ref=e78]:
            - generic [ref=e79]: ✓
            - generic [ref=e80]: Flexible scheduling
          - listitem [ref=e81]:
            - generic [ref=e82]: ✓
            - generic [ref=e83]: Single session — repurchase for more
        - generic [ref=e84]: ✅ Purchased & ready to use
        - button "Purchase Again" [ref=e85] [cursor=pointer]
    - separator [ref=e86]
    - heading "Subscription Plans" [level=2] [ref=e87]
    - paragraph [ref=e88]: Unlimited access during your plan period. Subscription overrides one-time usage tracking.
    - generic [ref=e89]:
      - generic [ref=e90]:
        - text: ✅ YOUR CURRENT PLAN
        - generic [ref=e91]: 📅
        - generic [ref=e92]: 1 Month
        - generic [ref=e93]:
          - text: ₹1,299
          - generic [ref=e94]: / mo
        - generic [ref=e95]: 30 days
        - list [ref=e96]:
          - listitem [ref=e97]:
            - generic [ref=e98]: ✓
            - generic [ref=e99]: Resume Builder (unlimited)
          - listitem [ref=e100]:
            - generic [ref=e101]: ✗
            - generic [ref=e102]: Mock Interview
          - listitem [ref=e103]:
            - generic [ref=e104]: ✓
            - generic [ref=e105]: 30-day access
          - listitem [ref=e106]:
            - generic [ref=e107]: ✗
            - generic [ref=e108]: Priority support
        - generic [ref=e109]: ✅ Your current plan · 30 days left
        - button "Renew / Upgrade" [ref=e110] [cursor=pointer]
      - generic [ref=e111]:
        - generic [ref=e112]: Most Popular
        - generic [ref=e113]: 🚀
        - generic [ref=e114]: 3 Months
        - generic [ref=e115]:
          - text: ₹1,999
          - generic [ref=e116]: / 3 mo
        - generic [ref=e117]: 90 days
        - list [ref=e118]:
          - listitem [ref=e119]:
            - generic [ref=e120]: ✓
            - generic [ref=e121]: Resume Builder (unlimited)
          - listitem [ref=e122]:
            - generic [ref=e123]: ✓
            - generic [ref=e124]: Mock Interview (unlimited)
          - listitem [ref=e125]:
            - generic [ref=e126]: ✓
            - generic [ref=e127]: 90-day access
          - listitem [ref=e128]:
            - generic [ref=e129]: ✗
            - generic [ref=e130]: Priority support
        - button "Get 3 Months" [ref=e131] [cursor=pointer]
      - generic [ref=e132]:
        - generic [ref=e133]: ⭐ BEST VALUE
        - generic [ref=e134]: 👑
        - generic [ref=e135]: Yearly
        - generic [ref=e136]:
          - text: ₹2,999
          - generic [ref=e137]: / yr
        - generic [ref=e138]: 365 days
        - list [ref=e139]:
          - listitem [ref=e140]:
            - generic [ref=e141]: ✓
            - generic [ref=e142]: Resume Builder (unlimited)
          - listitem [ref=e143]:
            - generic [ref=e144]: ✓
            - generic [ref=e145]: Mock Interview (unlimited)
          - listitem [ref=e146]:
            - generic [ref=e147]: ✓
            - generic [ref=e148]: 365-day access
          - listitem [ref=e149]:
            - generic [ref=e150]: ✓
            - generic [ref=e151]: Priority support
        - button "Get Yearly" [ref=e152] [cursor=pointer]
    - paragraph [ref=e153]: All prices inclusive of applicable taxes · Powered by Razorpay · Secure payments
```

# Test source

```ts
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
> 142 |     await razorpayFrame.locator('text=HDFC Bank').first().click();
      |                                                           ^ Error: locator.click: Test timeout of 120000ms exceeded.
  143 |   }
  144 |   await page.waitForTimeout(2000);
  145 | 
  146 |   // ── Step 8: Click Pay button ─────────────────────────────────────
  147 |   await razorpayFrame.getByRole('button', { name: /Pay/i }).first().click();
  148 |   await page.waitForTimeout(5000);
  149 | 
  150 |   // ── Step 9: Handle bank simulation page ─────────────────────────
  151 |   const successBtn = page.getByRole('button', { name: /Success/i });
  152 |   if (await successBtn.isVisible({ timeout: 10000 })) {
  153 |     await successBtn.click();
  154 |   }
  155 |   await page.waitForTimeout(8000);
  156 | 
  157 |   // ── Step 10: Verify success ───────────────────────────────────────
  158 |   await expect(page.locator('text=Payment successful')).toBeVisible({ timeout: 15000 });
  159 | 
  160 | });
```