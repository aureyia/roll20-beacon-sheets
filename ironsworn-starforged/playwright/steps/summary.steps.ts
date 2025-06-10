import { Given, When, Then } from '@cucumber/cucumber';
import { test, expect, Page, Browser, chromium, selectors } from '@playwright/test';

let browser: Browser;
let page: Page;

Given('a {string} web browser is launched', async (nom) => {
  selectors.setTestIdAttribute('data-qa')
  browser = await chromium.launch();
  page = await browser.newPage();
});

When('the player is on the summary page', async () => {
  await page.goto('http://127.0.0.1:5173/summary');
});

Then('the {string} field should be visible', async (string) => {
  await expect(page.getByTestId('character-name')).toBeVisible();
});
