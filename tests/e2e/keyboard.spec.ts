import { test, expect } from '@playwright/test';

for (const path of ['/', '/services/dry-eye-treatment/', '/blog/', '/book/']) {
  test(`keyboard pass ${path}: skip link first, visible focus ring, no trap`, async ({ page, isMobile, browserName }) => {
    test.skip(isMobile || browserName === 'webkit', 'desktop check; Safari does not Tab to links by default');
    await page.goto(path);
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(first).toBe('Skip to content');
    const seen = new Set<string>(); let ringless = 0;
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => { const e = document.activeElement as HTMLElement; const s = getComputedStyle(e); return { ours: ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'].includes(e.tagName), id: (e.tagName + (e.getAttribute('href') ?? e.id ?? '')).slice(0, 60), ring: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2 }; });
      seen.add(info.id); if (info.ours && !info.ring && browserName !== 'webkit') ringless++;
    }
    expect(seen.size).toBeGreaterThan(10);
    expect(ringless).toBe(0);
  });
}

test('reduced motion is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  const anim = await page.evaluate(() => [...document.querySelectorAll('.hero-slide img, .hw, .brands-track')].map((e) => getComputedStyle(e).animationName));
  anim.forEach((a) => expect(a).toBe('none'));
});

test('light and dark themes both render readable text (axe contrast covered in a11y.spec)', async ({ page }) => {
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme }); await page.goto('/');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(scheme === 'dark' ? 'rgb(10, 22, 38)' : 'rgb(255, 255, 255)');
  }
});
