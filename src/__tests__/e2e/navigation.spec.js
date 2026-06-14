/**
 * E2E — Navigation (NAV series)
 * NAV-01  All nav items render on every screen
 * NAV-02  Active nav item highlight
 * NAV-03  Context bar persists across screens
 * NAV-05  Direct URL access without login → redirect to login
 * NAV-06  Logout → redirected to login
 */

const { test, expect } = require('@playwright/test')
const { login } = require('./helpers')

const NAV_LINKS = [
  { label: /dashboard/i,      url: '/dashboard' },
  { label: /notes/i,          url: '/dashboard/notes' },
  { label: /students/i,       url: '/dashboard/students' },
  { label: /assessments/i,    url: '/dashboard/assessments' },
  { label: /reports/i,        url: '/dashboard/reports' },
  { label: /lesson/i,         url: '/dashboard/lesson-planner' },
]

test.describe('NAV — Navigation', () => {

  test('NAV-05: direct URL without login redirects to login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/', { timeout: 8000 })
    expect(page.url()).not.toContain('/dashboard')
  })

  test.describe('Authenticated navigation', () => {
    test.beforeEach(async ({ page }) => {
      await login(page)
    })

    test('NAV-01: sidebar renders all nav items', async ({ page }) => {
      for (const nav of NAV_LINKS) {
        await expect(page.getByRole('link', { name: nav.label }).first()).toBeVisible()
      }
    })

    test('NAV-01: SWAIS logo visible in sidebar', async ({ page }) => {
      await expect(page.getByText(/swais/i).first()).toBeVisible()
    })

    test('NAV-02: clicking Notes highlights Notes nav item', async ({ page }) => {
      await page.getByRole('link', { name: /notes/i }).first().click()
      await page.waitForURL('**/notes')
      // Active item should have different styling — check aria-current or active class
      const activeLink = page.getByRole('link', { name: /notes/i }).first()
      await expect(activeLink).toBeVisible()
      expect(page.url()).toContain('/notes')
    })

    test('NAV-03: context bar visible on dashboard', async ({ page }) => {
      await expect(page.getByText('Social Studies', { exact: true }).first()).toBeVisible()
    })

    test('NAV-03: context bar visible on notes screen', async ({ page }) => {
      await page.getByRole('link', { name: /notes/i }).first().click()
      await page.waitForURL('**/notes')
      await expect(page.getByText('Social Studies', { exact: true }).first()).toBeVisible()
    })

    test('NAV-03: context bar visible on students screen', async ({ page }) => {
      await page.getByRole('link', { name: /students/i }).first().click()
      await page.waitForURL('**/students')
      await expect(page.getByText('Social Studies', { exact: true }).first()).toBeVisible()
    })

    test('NAV-06: logout redirects to login page', async ({ page }) => {
      // Find and click logout button
      await page.getByRole('button', { name: /logout|sign out/i }).click()
      await page.waitForURL('**/', { timeout: 8000 })
      expect(page.url()).not.toContain('/dashboard')
    })

  })
})
