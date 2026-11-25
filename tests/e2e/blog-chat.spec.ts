import { test, expect } from '@playwright/test';

test('blog search and category filter', async ({ page }) => {
  await page.goto('/blog/');
  const cards = page.locator('#postGrid .journal:visible');
  const total = await cards.count(); expect(total).toBe(39);
  await page.fill('#blogSearch', 'glaucoma');
  const n = await cards.count(); expect(n).toBeGreaterThan(0); expect(n).toBeLessThan(total);
  await expect(page.locator('#blogCount')).toContainText(`${n} of 39`);
  await page.fill('#blogSearch', 'zzzzqqq'); await expect(page.locator('#blogEmpty')).toBeVisible();
  await page.fill('#blogSearch', '');
  await page.locator('.cat-chip[data-bcat="Dry Eye"]').click();
  const dry = await cards.count(); expect(dry).toBeGreaterThan(0); expect(dry).toBeLessThan(total);
  await expect(page.locator('.cat-chip[data-bcat="Dry Eye"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.cat-chip[data-bcat="All"]').click(); expect(await cards.count()).toBe(39);
});

test('article page: author, date, related, booking CTA, schema', async ({ page }) => {
  await page.goto('/blog/can-dry-eye-cause-blurry-vision/');
  await expect(page.locator('h1')).toHaveText('Can Dry Eye Cause Blurry Vision?');
  await expect(page.locator('article.article')).toContainText('By Pack Optical team');
  await expect(page.locator('time')).toHaveAttribute('datetime', '2024-09-16');
  expect(await page.locator('.post-grid .journal').count()).toBe(3);
  await expect(page.locator('article.article a[href="/book/"]').first()).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((t) => JSON.parse(t)['@type'] === 'BlogPosting')).toBe(true);
});

test('chat opens, answers a chip and free text, closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.getElementById('chatFab')!.click());
  await expect(page.locator('#chatPanel')).toHaveClass(/open/);
  await page.locator('#chatChips [data-flow="insurance"]').click();
  await expect(page.locator('#chatMsgs')).toContainText('VSP');
  await page.fill('#chatText', 'do you take aetna'); await page.keyboard.press('Enter');
  await expect(page.locator('#chatMsgs')).toContainText('Aetna plans are accepted');
  await page.fill('#chatText', 'sudden vision loss'); await page.keyboard.press('Enter');
  await expect(page.locator('#chatMsgs')).toContainText('could be an eye emergency');
  await page.keyboard.press('Escape'); await expect(page.locator('#chatPanel')).not.toHaveClass(/open/);
});

test('mobile Ask Pack button opens chat', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/'); await page.locator('.mobile-bar [data-open-chat]').click();
  await expect(page.locator('#chatPanel')).toHaveClass(/open/);
});
