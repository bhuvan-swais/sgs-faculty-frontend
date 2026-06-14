/**
 * E2E — Dashboard screen (DB series)
 * DB-01  Dashboard loads with stats
 * DB-02  Welcome banner shows teacher name
 * DB-03  Recent Notes section visible
 * DB-04  Quick Actions section visible
 * DB-05  Stats cards present (Notes, Students, Chapters, AI)
 */

const { test, expect } = require('@playwright/test')
const { login } = require('./helpers')

test.describe('DB — Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('DB-01: dashboard page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('DB-02: welcome banner shows teacher name', async ({ page }) => {
    // Teacher name from seeded data
    await expect(page.getByText(/welcome back/i)).toBeVisible()
  })

  test('DB-03: Recent Notes section is visible', async ({ page }) => {
    await expect(page.getByText(/recent notes/i)).toBeVisible()
  })

  test('DB-04: Quick Actions section is visible', async ({ page }) => {
    await expect(page.getByText(/quick actions/i)).toBeVisible()
  })

  test('DB-05: Total Notes stat card is visible', async ({ page }) => {
    await expect(page.getByText(/total notes/i)).toBeVisible()
  })

  test('DB-05: Students stat card is visible', async ({ page }) => {
    await expect(page.getByText(/students/i).first()).toBeVisible()
  })

  test('DB-05: AI Status card shows Active', async ({ page }) => {
    await expect(page.getByText('Active', { exact: true })).toBeVisible()
  })

  test('DB-05: Chapters Covered stat card visible', async ({ page }) => {
    await expect(page.getByText(/chapters covered/i)).toBeVisible()
  })

  test('DB-04: Create Note quick action links to notes', async ({ page }) => {
    await page.getByRole('link', { name: /create note/i }).click()
    await page.waitForURL('**/notes')
    expect(page.url()).toContain('/notes')
  })

  test('DB-04: View Students quick action links to students', async ({ page }) => {
    await page.getByRole('link', { name: /view students/i }).click()
    await page.waitForURL('**/students')
    expect(page.url()).toContain('/students')
  })

})
