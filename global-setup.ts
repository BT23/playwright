
// global-setup.ts
import { chromium } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages/login/loginPage';

const STORAGE_PATH = path.resolve(__dirname, 'auth-storage.json');
const BASE_URL = 'https://bonnie.mexcmms.com';

export default async function globalSetup() {
  console.log('🔐 Global setup: generating storageState →', STORAGE_PATH);

  const USERNAME = process.env.E2E_USERNAME;
  const PASSWORD = process.env.E2E_PASSWORD;
  if (!USERNAME || !PASSWORD) {
    throw new Error('Missing E2E_USERNAME or E2E_PASSWORD env vars for global setup login.');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  // Start at the root → should show login with reCAPTCHA
  await page.goto('/');

  // Perform real login once to obtain cookies/localStorage
  await loginPage.login(USERNAME, PASSWORD);

  // Wait for a reliable post-login signal (URL or element)
  await page.waitForURL(/\/Home/i);
  // or: await loginPage.assertLoginSuccess();

  // Persist authenticated state for later reuse
  await context.storageState({ path: STORAGE_PATH });
  await browser.close();

  console.log('✅ storageState written:', STORAGE_PATH);
}
