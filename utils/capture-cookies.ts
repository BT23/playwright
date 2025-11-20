import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import config from '../playwright.config';

(async () => {
  const baseURL = config.use?.baseURL || 'https://bonnie.mex.com.au';
  const loginURL = `${baseURL}/Account/Login`;

  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to login page
  await page.goto(loginURL);
  console.log(`✅ Browser opened at ${loginURL}. Please log in manually.`);

  // Wait until user confirms login
  console.log('👉 After logging in successfully, press Enter in this terminal to continue...');
  process.stdin.resume();
  await new Promise<void>(resolve => {
    process.stdin.once('data', () => resolve());
  });

  // Save storage state
  const storagePath = path.resolve('auth-storage.json');
  await context.storageState({ path: storagePath });
  console.log(`✅ Storage state saved to ${storagePath}`);

  await browser.close();
})();