import { test, expect, selectors } from '@playwright/test';

test('Nom1', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/summary');

  await expect(page.getByTestId('character-name')).toBeVisible();
  await expect(page.getByTestId('character-callsign')).toBeVisible();
  await expect(page.getByTestId('character-pronouns')).toBeVisible();
});
