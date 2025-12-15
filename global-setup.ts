
// global-setup.ts
import { chromium } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages/login/loginPage';

const STORAGE_PATH = path.resolve(__dirname, 'auth-storage.json');
const BASE_URL = process.env.BASE_URL || 'https://bonnie.mexcmms.com';

export default async function globalSetup() {
  console.log('🔐 Global setup: generating fresh storageState at', STORAGE_PATH);

  const USERNAME = process.env.E2E_USERNAME;
  const PASSWORD = process.env.E2E_PASSWORD;
  if (!USERNAME || !PASSWORD) {
    throw new Error('Missing E2E_USERNAME or E2E_PASSWORD env vars for global setup login.');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  // Navigate to a route that requires auth
  await page.goto(`${BASE_URL}/Home?baseRoute=true`);

  // Perform login with your page object
  await loginPage.login(USERNAME, PASSWORD);
  await loginPage.assertLoginSuccess();

  // Perform login with your page object
  await loginPage.login(USERNAME, PASSWORD);
  await loginPage.assertLoginSuccess();

  // Optional tiny delay if your app double-loads
  await page.waitForTimeout(500);

  // Save state for all tests
  await context.storageState({ path: STORAGE_PATH });
  await browser.close();

  console.log('✅ Global setup completed: storageState written to', STORAGE_PATH);
}
``
