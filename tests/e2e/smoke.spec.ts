import { test, expect } from '@playwright/test';

// Every URL built so far. Extend each day.
const services = ['comprehensive-eye-exams','childrens-eye-exams','diabetic-eye-exams','contact-lens-fittings','dry-eye-treatment','ipl-treatment','emergency-eye-care','digital-eye-strain','eye-disease-management','laser-surgery-consultation','aesthetics-med-spa'];
const urls: { path: string; title: RegExp }[] = [
  { path: '/', title: /Optometrist Fort Worth/ },
  { path: '/our-practice/', title: /Eye Doctor Fort Worth/ },
  { path: '/services/', title: /Eye Care Services Fort Worth/ },
  { path: '/eyewear/', title: /Designer Eyeglasses Fort Worth/ },
  { path: '/patient-centre/', title: /Patient Centre/ },
  { path: '/offers/', title: /Offers|Offers/i },
  { path: '/visit/', title: /Directions & Hours/ },
  { path: '/privacy/', title: /Privacy/ },
  { path: '/terms/', title: /Terms/ },
  { path: '/book/', title: /Book an Eye Exam Fort Worth/ },
  { path: '/blog/', title: /Eye Health Blog Fort Worth/ },
  { path: '/blog/can-dry-eye-cause-blurry-vision/', title: /Blurry Vision/ },
  ...services.map((s) => ({ path: `/services/${s}/`, title: /Fort Worth/ })),
];

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

for (const s of services) {
  test(`service ${s}: FAQ, book CTA, related links`, async ({ page }) => {
    await page.goto(`/services/${s}/`);
    expect(await page.locator('details.faq').count()).toBeGreaterThanOrEqual(4);
    await expect(page.locator('main a[href="/visit/"]').first()).toBeVisible();
    expect(await page.locator('main a[href^="/book/"], main a[href^="tel:"]').count()).toBeGreaterThan(0);
    expect(await page.locator('.info-box a[href^="/services/"], .info-box a[href="/eyewear/"], .info-box a[href="/offers/"]').count()).toBeGreaterThanOrEqual(2);
    expect(await page.locator('script[type="application/ld+json"]').count()).toBe(3);
  });
}
