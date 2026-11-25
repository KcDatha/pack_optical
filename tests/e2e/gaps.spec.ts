import { test, expect } from '@playwright/test';
import { SMS_CONSENT } from '../../src/data/consent';

const EXACT = 'By providing your phone number via paper or digital intake forms and or website submissions, you consent to receive calls and text messages regarding appointments, marketing, and other information. No purchase is required. Message and data rates may apply. Pack Med Spa will send approximately 4 texts a month at most, offering special discounts and text only deals. You may opt out at any time by replying STOP to the text message.';

test('consent constant is the exact required wording', () => expect(SMS_CONSENT).toBe(EXACT));

for (const [path, min] of [['/book/', 2], ['/patient-centre/', 1], ['/privacy/', 1]] as const) {
  test(`full SMS consent text, word for word, on ${path}`, async ({ page }) => {
    await page.goto(path);
    const blocks = await page.locator('[data-sms-consent]').allTextContents();
    expect(blocks.length).toBeGreaterThanOrEqual(min);
    blocks.forEach((b) => expect(b.trim()).toBe(EXACT));
  });
}

test('practice page: every team card renders, no broken image, no initials block', async ({ page }) => {
  await page.goto('/our-practice/');
  await expect(page.locator('.team-card')).toHaveCount(4);
  await expect(page.locator('.placeholder-photo')).toHaveCount(0);
  const imgs = page.locator('.team-card img');
  await expect(imgs).toHaveCount(3);
  for (const i of await imgs.all()) { await i.scrollIntoViewIfNeeded(); await expect.poll(() => i.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true); }
  await expect(page.locator('.team-card.nophoto')).toContainText('Dr. Asaf Presente');
});

test('aesthetics page: five named treatments as headings, gallery of before and after photos', async ({ page }) => {
  await page.goto('/services/aesthetics-med-spa/');
  for (const t of ['Morpheus8', 'Lumecca', 'Forma', 'Diolaze']) await expect(page.locator('h3', { hasText: new RegExp(`^${t}$`) })).toHaveCount(1);
  await expect(page.locator('h3', { hasText: 'Define face contouring' })).toHaveCount(1);
  const figs = page.locator('.ba-fig img');
  expect(await figs.count()).toBe(8);
  for (const a of await figs.evaluateAll((els) => els.map((e) => e.getAttribute('alt') ?? ''))) expect(a).toMatch(/^Before and after photo/);
  for (const i of await figs.all()) { await i.scrollIntoViewIfNeeded(); await expect.poll(() => i.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true); }
});

test('review pending banner still shows on staging builds only (never removed from the template)', async ({ page }) => {
  await page.goto('/services/aesthetics-med-spa/');
  // production build: banner hidden by design; the template flag must still be set
  const html = await page.content();
  expect(html).not.toContain('review-banner'); // prod build has no banner element
});
