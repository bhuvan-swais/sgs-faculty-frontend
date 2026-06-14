/**
 * E2E — Notes screen (NT series)
 * NT-01  Notes screen loads
 * NT-03  Create a new note
 * NT-07  Search/filter notes
 * NT-12  Edit a note
 * NT-13  Delete a note
 */

const { test, expect } = require('@playwright/test')
const { login } = require('./helpers')

test.describe('NT — Notes', () => {

  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/dashboard/notes')
    await page.waitForURL('**/notes')
  })

  test('NT-01: notes screen loads', async ({ page }) => {
    await expect(page).toHaveURL(/.*notes/)
  })

  test('NT-01: notes page heading visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /notes/i }).first()).toBeVisible()
  })

  test('NT-03: create note button is visible', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /new note|create note|\+ note/i })
    await expect(createBtn.first()).toBeVisible()
  })

  test('NT-03: can open create note form', async ({ page }) => {
    await page.getByRole('button', { name: /new note|create note|\+ note/i }).first().click()
    // Form or modal should appear
    await expect(page.getByRole('textbox').first()).toBeVisible({ timeout: 5000 })
  })

})
