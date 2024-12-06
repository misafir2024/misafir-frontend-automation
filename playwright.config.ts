import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry failed tests: 2 retries on CI, 0 retries locally */
  retries: process.env.CI ? 2 : 0,
  /* Limit workers on CI to avoid resource contention */
  workers: process.env.CI ? 1 : undefined,
  /* Reporters: Show results in the terminal and generate an HTML report */
  reporter: [["list"], ["html"]],
  /* Shared settings for all tests */
  use: {
    /* Base URL for the application */
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    /* Collect trace on first retry */
    trace: "on-first-retry",

    /* Run tests in headless mode */
    headless: true,

    /* Screenshot on test failure */
    screenshot: "only-on-failure",
  },

  /* Browser configurations for different environments */
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "Desktop Firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "Desktop Safari",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // {
    //   name: "Mobile Chrome",
    //   use: { ...devices["Pixel 5"] },
    // },
    // {
    //   name: "Mobile Safari",
    //   use: { ...devices["iPhone 12"] },
    // },
  ],

  /* Automatically start your local dev server before tests */
  webServer: {
    command: "npm run dev", // Adjust command to match your development start script
    url: process.env.BASE_URL || "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
