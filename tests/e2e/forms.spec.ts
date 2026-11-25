import { test, expect, type Page } from '@playwright/test';
import { SITE } from '../../src/data/site';

// The Pages Function is not served by `astro preview`, so the API is mocked here.
// The server logic itself (validation, Turnstile, Resend, auto reply) is covered by tests/unit/forms.test.ts.
async function mockApi(page: Page, endpoint: string, reply: { status?: number; body: unknown }) {
  const calls: unknown[] = [];
  await page.route(`**${endpoint}`, async (route) => { calls.push(route.request().postDataJSON()); await route.fulfill({ status: reply.status ?? 200, contentType: 'application/json', body: JSON.stringify(reply.body) }); });
  return calls;
}
const fillBooking = async (page: Page) => {
  await page.selectOption('#service', 'dryeye'); await page.selectOption('#day', 'Monday'); await page.selectOption('#time', 'Morning');
  await page.fill('#name', 'Jordan Smith'); await page.fill('#phone', '(817) 555-0100'); await page.fill('#email', 'j@example.com');
};

test('booking request: validation errors for missing name, bad phone, bad email', async ({ page }) => {
  await page.goto('/book/');
  const calls = await mockApi(page, '/api/request', { status: 422, body: { ok: false, errors: { name: 'Please enter your full name.', phone: 'Please enter a valid 10-digit phone number.', email: 'That email address does not look right.' } } });
  await page.selectOption('#service', 'exam'); await page.selectOption('#day', 'Tuesday'); await page.selectOption('#time', 'Afternoon');
  await page.fill('#phone', '123'); await page.fill('#email', 'nope');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('[data-err="name"]')).toBeVisible();
  await expect(page.locator('[data-err="phone"]')).toContainText('10-digit');
  await expect(page.locator('[data-err="email"]')).toBeVisible();
  expect(calls).toHaveLength(1);
});

test('booking request: success shows confirmation with reference and request wording', async ({ page }) => {
  await page.goto('/book/');
  const calls = (await mockApi(page, '/api/request', { body: { ok: true, reference: 'PACK-ABC234' } })) as Record<string, string>[];
  await fillBooking(page);
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('#refCode')).toHaveText('PACK-ABC234');
  await expect(page.locator('#confirmPane')).toContainText('request, not a confirmed appointment');
  await expect(page.locator('#finalSummary')).toContainText('Jordan Smith');
  expect(calls[0].service).toBe('dryeye'); expect(calls[0].website).toBe('');
});

test('booking: turnstile failure shows a spam-check message', async ({ page }) => {
  await page.goto('/book/');
  await mockApi(page, '/api/request', { status: 403, body: { ok: false, error: 'turnstile' } });
  await fillBooking(page); await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('[data-status]')).toContainText('spam check');
});

test('contact form sends and shows a reference', async ({ page }) => {
  await page.goto('/patient-centre/');
  await mockApi(page, '/api/contact', { body: { ok: true, reference: 'PACK-XYZ789' } });
  await page.fill('#cName', 'Al Jones'); await page.fill('#cEmail', 'al@example.com'); await page.fill('#cMsg', 'Do you stock Acuvue lenses?');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contactRef')).toHaveText('PACK-XYZ789');
});

test('PRIVACY: forms contain no health, insurance-ID or date-of-birth fields', async ({ page }) => {
  for (const path of ['/book/', '/patient-centre/']) {
    await page.goto(path);
    const names = await page.locator('form input, form select, form textarea').evaluateAll((els) => els.map((e) => `${e.getAttribute('name')} ${e.id} ${(e.closest('.field')?.querySelector('label')?.textContent ?? '')}`.toLowerCase()));
    for (const n of names) for (const bad of ['birth', 'dob', 'symptom', 'insurance id', 'member id', 'diagnos', 'medication', 'history']) expect(n).not.toContain(bad);
  }
});

test('book and call buttons work: tel link correct on every page', async ({ page }) => {
  for (const path of ['/', '/services/dry-eye-treatment/', '/visit/', '/book/', '/blog/']) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="tel:"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0); hrefs.forEach((h) => expect(h).toBe('tel:+18178316141'));
    await expect(page.locator('header a[href="/book/"]').first()).toBeVisible();
  }
});

test('Book page shows both booking buttons with the SITE constant URLs', async ({ page }) => {
  await page.goto('/book/');
  const weave = page.locator('#bookChoice a', { hasText: 'Book with Weave' });
  const moxie = page.locator('#bookChoice a', { hasText: 'Book with Moxie' });
  await expect(weave).toHaveAttribute('href', SITE.weaveUrl); await expect(moxie).toHaveAttribute('href', SITE.moxieUrl);
  for (const l of [weave, moxie]) { await expect(l).toHaveAttribute('target', '_blank'); await expect(l).toHaveAttribute('rel', /noopener/); }
  await expect(page.getByText('If you prefer, send a request and our office will call you back.')).toBeVisible();
});

test('aesthetics page main CTA goes to Moxie, eye care pages to Weave, both with a request fallback', async ({ page }) => {
  await page.goto('/services/aesthetics-med-spa/');
  await expect(page.locator('[data-main-cta]')).toHaveAttribute('href', SITE.moxieUrl);
  await expect(page.locator('.info-box a[href="/book/"]')).toContainText('send a request instead');
  for (const s of ['dry-eye-treatment', 'comprehensive-eye-exams', 'childrens-eye-exams']) {
    await page.goto(`/services/${s}/`);
    await expect(page.locator('[data-main-cta]')).toHaveAttribute('href', SITE.weaveUrl);
    await expect(page.locator('.info-box a[href="/book/"]')).toContainText('send a request instead');
  }
});

test('header, hero and mobile bar Book buttons still go to /book/', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header a.btn-gold')).toHaveAttribute('href', '/book/');
  await expect(page.locator('.hero-ctas a.btn-gold')).toHaveAttribute('href', '/book/');
  await expect(page.locator('.mobile-bar a.mb-book')).toHaveAttribute('href', '/book/');
});
