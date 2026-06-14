/**
 * E2E — Students screen (ST series)
 * ST-01  Students list loads
 * ST-02  Student roll numbers shown
 */

const { test, expect } = require('@playwright/test')
const { login } = require('./helpers')

test.describe('ST — Students', () => {

  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/dashboard/students')
    await page.waitForURL('**/students')
  })

  test('ST-01: students screen loads', async ({ page }) => {
    await expect(page).toHaveURL(/.*students/)
  })

  test('ST-01: students page heading visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /students/i }).first()).toBeVisible()
  })

  test('ST-01: student list renders', async ({ page }) => {
    // Wait for list to load
    await page.waitForTimeout(2000)
    const rows = page.locator('table tbody tr, [data-testid="student-row"], .student-card')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

})
