import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/services/', '/services/dry-eye-treatment/', '/services/emergency-eye-care/', '/our-practice/', '/eyewear/', '/patient-centre/', '/offers/', '/visit/', '/privacy/', '/book/', '/blog/', '/blog/can-dry-eye-cause-blurry-vision/'];
for (const scheme of ['light', 'dark'] as const) for (const path of pages) {
  test(`axe ${path} ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto(path);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const bad = r.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(bad.map((v) => v.id)).toEqual([]);
  });
}
