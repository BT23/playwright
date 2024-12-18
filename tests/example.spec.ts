import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  //await page.goto('https://playwright.dev/');
  //await page.goto('https://trial.mex.com.au/mex/');
  await page.goto('http://bonnie.mex16.dev/');

  // Expect a title "to contain" a substring.
  //await expect(page).toHaveTitle(/Playwright/);
  await expect(page).toHaveTitle(/MEX Login/);
});

test('get started link', async ({ page }) => {
  //await page.goto('https://playwright.dev/');
  //await page.goto('https://trial.mex.com.au/mex/');
  await page.goto('http://bonnie.mex16.dev/');

  // Click the get started link.
  //await page.getByRole('link', { name: 'Assets' }).click();
  await page.getByRole('link', { name: 'Forgot password?' }).click();


  // Expects page to have a heading with the name of Installation.
  //await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  //await expect(page.getByLabel('Forgot PasswordEmail')).fill('bonnie.tang@mex.com.au');
  //await expect(page.getByRole('button',{name: 'Ok'})).toBeVisible();
  //await page.locator('input:right-of(:text("Email"))').fill('bonnie.tang@mex.com.au');
  await expect(page.locator('label.headerText')).toHaveText('Forgot Password');
});
