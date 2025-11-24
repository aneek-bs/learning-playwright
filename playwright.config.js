import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 1,
  timeout: 15 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  reporter: 'html',
  use: {
    browserName: 'firefox',
    headless: true,
    // screenshot: 'only-on-failure',
    // trace: 'retain-on-failure',
  },
});
