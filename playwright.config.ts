import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  webServer: { command: 'npm run build && node scripts/serve-dist.mjs', url: 'http://localhost:4321/', reuseExistingServer: true, timeout: 180000 },
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Firefox's Playwright build does not launch on this dev Mac (macOS 27); set PW_FIREFOX=1 on CI or another machine.
    ...(process.env.PW_FIREFOX ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }] : []),
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'iphone', use: { ...devices['iPhone 14'] } },
  ],
});
