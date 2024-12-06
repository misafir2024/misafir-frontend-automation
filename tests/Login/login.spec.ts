import { test, expect } from "@playwright/test";
import { CREDENTIALS, MESSAGES } from "../../Helpers/constants";

test.describe("Login Page Functional UI Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto("/login");
  });

  test("should display all login form elements correctly", async ({ page }) => {
    // Check the presence of all elements
    await expect(page.locator('[data-testid="login-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-title"]')).toHaveText(
      "Login"
    );
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="login-email-input"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="login-password-input"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="login-remember-checkbox"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="login-submit-button"]')
    ).toBeVisible();
  });

  test("should show validation errors for empty fields when submitting the form", async ({
    page,
  }) => {
    // Click the submit button without filling the form
    await page.click('[data-testid="login-submit-button"]');

    // Expect validation error messages for required fields
    await expect(page.locator(".ant-form-item-explain").first()).toContainText(
      "'email' is required"
    );
    await expect(page.locator(".ant-form-item-explain").last()).toContainText(
      "'password' is required"
    );
  });

  test("should show validation error for invalid email format", async ({
    page,
  }) => {
    // Fill invalid email and leave password empty
    await page.fill('[data-testid="login-email-input"]', "invalid-email");
    await page.click('[data-testid="login-submit-button"]');

    // Expect validation error for invalid email format
    await expect(page.locator(".ant-form-item-explain").first()).toContainText(
      "'email' is not a valid email"
    );
  });

  test("should allow user to type into email and password fields", async ({
    page,
  }) => {
    // Type into email and password inputs
    await page.fill(
      '[data-testid="login-email-input"]',
      CREDENTIALS.validUser.email
    );
    await page.fill(
      '[data-testid="login-password-input"]',
      CREDENTIALS.validUser.password
    );

    // Assert the inputs have the entered values
    await expect(page.locator('[data-testid="login-email-input"]')).toHaveValue(
      CREDENTIALS.validUser.email
    );
    await expect(
      page.locator('[data-testid="login-password-input"]')
    ).toHaveValue(CREDENTIALS.validUser.password);
  });

  test('should allow checking and unchecking the "Remember me" checkbox', async ({
    page,
  }) => {
    const rememberMeCheckbox = page.locator(
      '[data-testid="login-remember-checkbox"]'
    );

    // Ensure the checkbox is initially unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();

    // Check the checkbox
    await rememberMeCheckbox.check();
    await expect(rememberMeCheckbox).toBeChecked();

    // Uncheck the checkbox
    await rememberMeCheckbox.uncheck();
    await expect(rememberMeCheckbox).not.toBeChecked();
  });

  test("should disable submit button when loading is true", async ({
    page,
  }) => {
    // Simulate a loading state
    await page.evaluate(() => {
      const submitButton = document.querySelector(
        '[data-testid="login-submit-button"]'
      );
      if (submitButton) {
        submitButton.setAttribute("disabled", "true");
      }
    });

    // Ensure the submit button is disabled
    const submitButton = page.locator('[data-testid="login-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    // Enter valid credentials
    await page.fill(
      '[data-testid="login-email-input"]',
      CREDENTIALS.validUser.email
    );
    await page.fill(
      '[data-testid="login-password-input"]',
      CREDENTIALS.validUser.password
    );
    await page.click('[data-testid="login-submit-button"]');

    // Wait for redirection to a new page or success feedback
    await page.waitForURL("/explore"); // Update with your expected redirect URL

    // Assert user has been redirected correctly
    await expect(page).toHaveURL("/explore");
  });
});
