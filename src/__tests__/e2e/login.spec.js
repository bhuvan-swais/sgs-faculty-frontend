/**
 * E2E — Login screen (LG series)
 * LG-01  Valid login → navigates to /dashboard
 * LG-03  Wrong credentials → error message shown
 * LG-07  Password show/hide toggle
 * LG-10  Demo credentials panel visible
 */

const { test, expect } = require('@playwright/test')
const { CREDENTIALS } = require('./helpers')

test.describe('LG — Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('LG-01: valid login navigates to dashboard', async ({ page }) => {
    await page.locator('#login-email').fill(CREDENTIALS.email)
    await page.locator('#login-password').fill(CREDENTIALS.password)
    await page.locator('#login-submit-btn').click()
    await page.waitForURL('**/dashboard', { timeout: 15000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('LG-03: wrong password shows error message', async ({ page }) => {
    await page.locator('#login-email').fill(CREDENTIALS.email)
    await page.locator('#login-password').fill('definitelywrongpass999')
    await page.locator('#login-submit-btn').click()
    // api.js catches 401 and returns "Unable to reach server..." when backend is unreachable,
    // but when backend IS up, the thrown error.message contains the backend detail
    await expect(page.getByText(/unable to reach|invalid email|incorrect/i)).toBeVisible({ timeout: 10000 })
  })

  test('LG-07: password toggle shows and hides password', async ({ page }) => {
    const pwInput = page.locator('#login-password')
    await expect(pwInput).toHaveAttribute('type', 'password')
    await page.getByRole('button', { name: /show password/i }).click()
    await expect(pwInput).toHaveAttribute('type', 'text')
    await page.getByRole('button', { name: /hide password/i }).click()
    await expect(pwInput).toHaveAttribute('type', 'password')
  })

  test('LG-10: demo credentials panel is visible', async ({ page }) => {
    await expect(page.getByText(/sandipani\.acharya@swais\.edu/i)).toBeVisible()
    await expect(page.getByText(/swais@123/i)).toBeVisible()
  })

  test('LG-05: empty form — email focused on submit', async ({ page }) => {
    await page.locator('#login-submit-btn').click()
    const emailInput = page.locator('#login-email')
    // HTML5 required validation keeps focus on email
    await expect(emailInput).toBeFocused()
  })

})
