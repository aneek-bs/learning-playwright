import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  // reporter: 'html',
  use: {
    browserName: 'firefox',
    headless: false,
    // screenshot: 'only-on-failure',
    // trace: 'retain-on-failure',
  },
});
