/**
 * Shared E2E helpers — login, navigation shortcuts.
 */

const CREDENTIALS = {
  email: 'sandipani.acharya@swais.edu',
  password: 'swais@123',
}

/**
 * Log in and wait for dashboard to load.
 */
async function login(page) {
  await page.goto('/')
  await page.locator('#login-email').fill(CREDENTIALS.email)
  await page.locator('#login-password').fill(CREDENTIALS.password)
  await page.locator('#login-submit-btn').click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

module.exports = { login, CREDENTIALS }
