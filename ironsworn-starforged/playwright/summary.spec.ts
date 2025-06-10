import { test, expect, selectors } from '@playwright/test';

test('Test 1', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/summary');

  await expect(page.getByTestId('character-name')).toBeVisible();
  await expect(page.getByTestId('character-callsign')).toBeVisible();
  await expect(page.getByTestId('character-pronouns')).toBeVisible();
});

test('Test 2', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/summary');

  await page.getByText('moves').click();
  await page.locator('div:nth-child(6) > div:nth-child(2) > .h7 > .button-container > .inline-flex').click();
  await page.getByRole('button', { name: 'Roll' }).click();
  await page.getByText('Move at speed').click();
  await page.getByRole('button', { name: 'Increase' }).click();
  await page.getByRole('button', { name: 'Roll' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
})
