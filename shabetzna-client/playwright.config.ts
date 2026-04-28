import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    use: {
        baseURL: "http://127.0.0.1:7070",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        actionTimeout: 0,
        navigationTimeout: 30000,
    },
    webServer: {
        command: "npm run dev",
        url: "http://127.0.0.1:7070",
        reuseExistingServer: true,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
