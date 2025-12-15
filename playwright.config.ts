
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'https://bonnie.mexcmms.com';
const STORAGE_PATH = path.resolve(__dirname, 'auth-storage.json');

// Decide whether to run global setup:
// - On CI
// - Or when explicitly requested locally via USE_GLOBAL_SETUP=true
const shouldRunGlobalSetup = !!process.env.CI || process.env.USE_GLOBAL_SETUP === 'true';

// Only use storageState if the file exists (avoids errors locally when not generated yet)
const storageStateToUse = fs.existsSync(STORAGE_PATH) ? STORAGE_PATH : undefined;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.test.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 180000, // 3 minutes per test

  // Run once before tests—conditionally (CI or USE_GLOBAL_SETUP)
  ...(shouldRunGlobalSetup
    ? { globalSetup: path.resolve(__dirname, './global-setup.ts') }
    : {}),

  // 🔧 Single unified "use" block
  use: {
    baseURL: BASE_URL,
    // Only preload storageState if file exists
    storageState: storageStateToUse,
    headless: true,

    // 🎥 Artifacts
    video: process.env.CI ? 'retain-on-failure' : 'on',
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'smoke',
      grep: /@smoke/,
    },
    {
      name: 'regression',
      grep: /@regression/,
    },
    // Uncomment mobile/browser variants if needed
    // { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    // { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
    // { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    // { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  ],
});
