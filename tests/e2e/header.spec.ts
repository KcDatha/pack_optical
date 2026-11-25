import { test, expect } from '@playwright/test';
import { SITE } from '../../src/data/site';

for (const path of ['/', '/services/dry-eye-treatment/']) {
  test(`no utility bar in the DOM on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('.util-bar')).toHaveCount(0);
    await expect(page.locator('.util-in')).toHaveCount(0);
  });
}

test('desktop header Order Contacts link points to SITE.contactsOrderUrl', async ({ page, isMobile }) => {
  test.skip(isMobile, 'header link is hidden on small screens; mobile menu entry is tested below');
  await page.goto('/');
  const l = page.locator('header [data-order-contacts]');
  await expect(l).toBeVisible();
  await expect(l).toHaveAttribute('href', SITE.contactsOrderUrl);
  await expect(l).toHaveAttribute('target', '_blank'); await expect(l).toHaveAttribute('rel', /noopener/);
});

test('header stays stuck to the top on scroll', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.locator('header.site').evaluate((e) => Math.round(e.getBoundingClientRect().top))).toBe(0);
});

test('mobile menu opens, lists Patient Centre and Order Contacts, and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  const btn = page.locator('#menuBtn'); const nav = page.locator('#mobileNav');
  await expect(nav).toBeHidden();
  await btn.click(); await expect(nav).toBeVisible(); await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.locator('a[href="/patient-centre/"]')).toBeVisible();
  const oc = nav.locator(`a[href="${SITE.contactsOrderUrl}"]`);
  await expect(oc).toBeVisible(); await expect(oc).toHaveAttribute('target', '_blank'); await expect(oc).toHaveAttribute('rel', /noopener/);
  await expect(nav.locator('a[href="/services/"]')).not.toHaveAttribute('target', '_blank');
  await btn.click(); await expect(nav).toBeHidden(); await expect(btn).toHaveAttribute('aria-expanded', 'false');
});
