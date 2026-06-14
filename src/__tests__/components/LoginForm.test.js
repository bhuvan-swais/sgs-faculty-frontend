/**
 * Unit tests for LoginForm component.
 *
 * useAuth and useRouter are mocked so no real API calls or navigation occur.
 *
 * Test IDs covered:
 *   LG-01  Valid login → router.push('/dashboard') called
 *   LG-03  Wrong credentials → error message displayed
 *   LG-07  Password show/hide toggle changes input type
 *   LG-10  Demo credentials panel visible with correct values
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/auth/LoginForm'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockLogin = jest.fn()
const mockClearError = jest.fn()

let mockAuthState = {
  isLoading: false,
  error: null,
  login: mockLogin,
  clearError: mockClearError,
}

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderForm() {
  return render(<LoginForm />)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockAuthState = {
    isLoading: false,
    error: null,
    login: mockLogin,
    clearError: mockClearError,
  }
})

// ── Rendering ─────────────────────────────────────────────────────────────────

describe('Rendering', () => {
  test('renders email input', () => {
    renderForm()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })

  test('renders password input', () => {
    renderForm()
    // Use selector to avoid matching the eye-icon button's aria-label="Show password"
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument()
  })

  test('renders Sign In button', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('LG-10: demo credentials panel is visible', () => {
    renderForm()
    expect(screen.getByText(/sandipani\.acharya@swais\.edu/i)).toBeInTheDocument()
    expect(screen.getByText(/swais@123/i)).toBeInTheDocument()
  })

  test('password input is masked by default', () => {
    renderForm()
    const pwInput = screen.getByLabelText(/password/i, { selector: 'input' })
    expect(pwInput).toHaveAttribute('type', 'password')
  })

  test('email input has type email', () => {
    renderForm()
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })
})

// ── Form submission ───────────────────────────────────────────────────────────

describe('Form submission', () => {
  test('LG-01: valid login calls router.push("/dashboard")', async () => {
    mockLogin.mockResolvedValue({ success: true })
    renderForm()

    await userEvent.type(screen.getByLabelText(/email address/i), 'sandipani.acharya@swais.edu')
    await userEvent.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'swais@123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('LG-01: login called with correct email and password', async () => {
    mockLogin.mockResolvedValue({ success: true })
    renderForm()

    await userEvent.type(screen.getByLabelText(/email address/i), 'sandipani.acharya@swais.edu')
    await userEvent.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'swais@123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('sandipani.acharya@swais.edu', 'swais@123')
    })
  })

  test('clearError is called before each submission attempt', async () => {
    mockLogin.mockResolvedValue({ success: true })
    renderForm()

    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'pass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled()
    })
  })

  test('LG-03: failed login does not navigate to dashboard', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid email or password' })
    renderForm()

    await userEvent.type(screen.getByLabelText(/email address/i), 'sandipani.acharya@swais.edu')
    await userEvent.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})

// ── Error display ─────────────────────────────────────────────────────────────

describe('LG-03 Error display', () => {
  test('shows error message when auth context has an error', () => {
    mockAuthState.error = 'Invalid email or password'
    renderForm()
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
  })

  test('does not show error block when error is null', () => {
    mockAuthState.error = null
    renderForm()
    expect(screen.queryByText(/invalid email or password/i)).not.toBeInTheDocument()
  })
})

// ── Password toggle ───────────────────────────────────────────────────────────

describe('LG-07 Password visibility toggle', () => {
  test('LG-07: clicking eye icon reveals password', async () => {
    renderForm()
    const pwInput = screen.getByLabelText(/password/i, { selector: 'input' })
    const eyeBtn = screen.getByRole('button', { name: /show password/i })

    await userEvent.click(eyeBtn)
    expect(pwInput).toHaveAttribute('type', 'text')
  })

  test('LG-07: clicking eye icon twice re-masks password', async () => {
    renderForm()
    const pwInput = screen.getByLabelText(/password/i, { selector: 'input' })
    const eyeBtn = screen.getByRole('button', { name: /show password/i })

    await userEvent.click(eyeBtn)
    await userEvent.click(eyeBtn)
    expect(pwInput).toHaveAttribute('type', 'password')
  })
})

// ── Loading state ─────────────────────────────────────────────────────────────

describe('Loading state', () => {
  test('Sign In button shows "Signing in…" and is disabled while loading', () => {
    mockAuthState.isLoading = true
    renderForm()
    // When isLoading=true the button text changes to "Signing in…" and is disabled
    const btn = screen.getByRole('button', { name: /signing in/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeDisabled()
  })
})
