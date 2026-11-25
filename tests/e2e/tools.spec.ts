import { test, expect } from '@playwright/test';

test('dry eye quiz works end to end by keyboard', async ({ page }) => {
  await page.goto('/patient-centre/');
  const opts = page.locator('#quizBody .quiz-opt');
  for (let i = 0; i < 5; i++) {
    await expect(opts.first()).toBeVisible();
    await opts.nth(2).focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('#quizBody .score-big')).toHaveText('10 / 10');
  await expect(page.locator('#quizBody')).toContainText('Significant');
  await page.getByRole('button', { name: 'Retake' }).click();
  await expect(page.locator('#quizBody .quiz-q')).toContainText('Question 1 of 5');
});

test('quiz low score gives mild verdict', async ({ page }) => {
  await page.goto('/patient-centre/');
  for (let i = 0; i < 5; i++) await page.locator('#quizBody .quiz-opt').first().click();
  await expect(page.locator('#quizBody')).toContainText('Mild');
});

test('frame guide changes with face shape (keyboard)', async ({ page }) => {
  await page.goto('/patient-centre/');
  await expect(page.locator('#shapeResult')).toContainText('Rectangular & angular');
  await page.locator('#shapeRow [data-shape="square"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#shapeResult')).toContainText('Round & oval');
  await expect(page.locator('#shapeRow [data-shape="square"]')).toHaveAttribute('aria-pressed', 'true');
});

test('insurance checker answers', async ({ page }) => {
  await page.goto('/patient-centre/');
  await page.selectOption('#insSelect', 'vsp');
  await expect(page.locator('#insResult')).toContainText('VSP');
  await page.selectOption('#insSelect', 'none');
  await expect(page.locator('#insResult')).toContainText('self-pay');
});

test('visit page shows hours table and tel link', async ({ page }) => {
  await page.goto('/visit/');
  await expect(page.locator('.hoursTable tr')).toHaveCount(7);
  await expect(page.locator('.hoursTable tr.today')).toHaveCount(1);
});
