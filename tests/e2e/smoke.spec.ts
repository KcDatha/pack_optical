import { test, expect } from '@playwright/test';

// Every URL built so far. Extend each day.
const urls: { path: string; title: RegExp }[] = [{ path: '/', title: /Optometrist Fort Worth/ }];

for (const u of urls) {
  test(`smoke ${u.path}`, async ({ page }) => {
    const res = await page.goto(u.path);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(u.title);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('404 page', async ({ page }) => {
  const res = await page.goto('/does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('home: NAP and tel link', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toContainText('1217 Oak Knoll Drive, Fort Worth, TX 76117');
  await expect(page.locator('a[href="tel:+18178316141"]').first()).toBeVisible();
});

test('mobile menu opens and closes by keyboard', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  const btn = page.locator('#menuBtn');
  await btn.focus(); await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
});
