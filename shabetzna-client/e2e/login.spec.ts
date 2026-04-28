import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
    test("renders the login screen and login button", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("button", { name: /התחבר|login/i })).toBeVisible();
    });
});
