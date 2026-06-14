/**
 * Unit tests for AuthContext (AuthProvider + useAuth hook).
 *
 * loginTeacher (api.js) is mocked so no real HTTP calls are made.
 *
 * Test IDs covered:
 *   LG-01  Login sets user in context and persists to localStorage
 *   LG-03  Failed login sets error, user stays null
 *   NAV-06 Logout clears user and removes localStorage entry
 *   NAV-04 Session restore from localStorage on mount
 */

import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/context/AuthContext'

// Mock the api module so no real fetch calls happen
jest.mock('@/lib/api', () => ({
  loginTeacher: jest.fn(),
  logoutTeacher: jest.fn().mockResolvedValue(undefined),
}))

import { loginTeacher, logoutTeacher } from '@/lib/api'

// ── Test component that exposes context values ────────────────────────────────

function TestConsumer() {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError } = useAuth()
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'null'}</div>
      <div data-testid="authenticated">{String(isAuthenticated)}</div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="error">{error || 'null'}</div>
      <button onClick={() => login('sandipani.acharya@swais.edu', 'swais@123')}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={clearError}>Clear Error</button>
    </div>
  )
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  )
}

const MOCK_USER = {
  id: 'T001',
  teacher_id: 1,
  name: 'Sandipani Acharya',
  email: 'sandipani.acharya@swais.edu',
  avatar: 'SA',
  subject: 'Social Studies',
}

beforeEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})

// ── Initial state ─────────────────────────────────────────────────────────────

describe('Initial state', () => {
  test('user is null before login', async () => {
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null')
    })
  })

  test('isAuthenticated is false before login', async () => {
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false')
    })
  })

  test('isLoading becomes false after mount', async () => {
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
  })

  test('error is null initially', async () => {
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('null')
    })
  })
})

// ── Session restore ───────────────────────────────────────────────────────────

describe('NAV-04 Session restore from localStorage', () => {
  test('restores user from localStorage on mount', async () => {
    localStorage.setItem('swais_faculty_auth', JSON.stringify(MOCK_USER))
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Sandipani Acharya')
    })
  })

  test('isAuthenticated is true when session is restored', async () => {
    localStorage.setItem('swais_faculty_auth', JSON.stringify(MOCK_USER))
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
    })
  })

  test('invalid JSON in localStorage is handled gracefully', async () => {
    localStorage.setItem('swais_faculty_auth', 'NOT_VALID_JSON')
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null')
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
  })
})

// ── Login ─────────────────────────────────────────────────────────────────────

describe('LG-01 Successful login', () => {
  test('sets user in context', async () => {
    loginTeacher.mockResolvedValue({ success: true, user: MOCK_USER })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Sandipani Acharya')
    })
  })

  test('sets isAuthenticated to true', async () => {
    loginTeacher.mockResolvedValue({ success: true, user: MOCK_USER })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
    })
  })

  test('persists user to localStorage', async () => {
    loginTeacher.mockResolvedValue({ success: true, user: MOCK_USER })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      const stored = localStorage.getItem('swais_faculty_auth')
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored).name).toBe('Sandipani Acharya')
    })
  })

  test('clears any existing error on successful login', async () => {
    loginTeacher.mockResolvedValue({ success: true, user: MOCK_USER })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('null')
    })
  })
})

// ── Login failure ─────────────────────────────────────────────────────────────

describe('LG-03 Failed login', () => {
  test('sets error message in context', async () => {
    loginTeacher.mockResolvedValue({ success: false, error: 'Invalid email or password' })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Invalid email or password')
    })
  })

  test('user stays null on failed login', async () => {
    loginTeacher.mockResolvedValue({ success: false, error: 'Invalid email or password' })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null')
    })
  })

  test('does not store anything in localStorage on failure', async () => {
    loginTeacher.mockResolvedValue({ success: false, error: 'Invalid email or password' })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => screen.getByTestId('error').textContent !== 'null')
    expect(localStorage.getItem('swais_faculty_auth')).toBeNull()
  })

  test('unexpected exception sets generic error message', async () => {
    loginTeacher.mockRejectedValue(new Error('Unexpected crash'))
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toMatch(/unexpected error/i)
    })
  })
})

// ── Logout ────────────────────────────────────────────────────────────────────

describe('NAV-06 Logout', () => {
  test('clears user from context', async () => {
    localStorage.setItem('swais_faculty_auth', JSON.stringify(MOCK_USER))
    renderWithAuth()
    await waitFor(() => screen.getByTestId('user').textContent === 'Sandipani Acharya')
    await userEvent.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('null')
    })
  })

  test('sets isAuthenticated to false', async () => {
    localStorage.setItem('swais_faculty_auth', JSON.stringify(MOCK_USER))
    renderWithAuth()
    await waitFor(() => screen.getByTestId('authenticated').textContent === 'true')
    await userEvent.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false')
    })
  })

  test('removes swais_faculty_auth from localStorage', async () => {
    localStorage.setItem('swais_faculty_auth', JSON.stringify(MOCK_USER))
    renderWithAuth()
    await waitFor(() => screen.getByTestId('user').textContent === 'Sandipani Acharya')
    await userEvent.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(localStorage.getItem('swais_faculty_auth')).toBeNull()
    })
  })

  test('calls logoutTeacher API', async () => {
    localStorage.setItem('swais_faculty_auth', JSON.stringify(MOCK_USER))
    renderWithAuth()
    await waitFor(() => screen.getByTestId('user').textContent === 'Sandipani Acharya')
    await userEvent.click(screen.getByText('Logout'))
    await waitFor(() => {
      expect(logoutTeacher).toHaveBeenCalledTimes(1)
    })
  })
})

// ── clearError ────────────────────────────────────────────────────────────────

describe('clearError', () => {
  test('resets error to null', async () => {
    loginTeacher.mockResolvedValue({ success: false, error: 'Some error' })
    renderWithAuth()
    await waitFor(() => screen.getByTestId('loading').textContent === 'false')
    await userEvent.click(screen.getByText('Login'))
    await waitFor(() => screen.getByTestId('error').textContent !== 'null')
    await userEvent.click(screen.getByText('Clear Error'))
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('null')
    })
  })
})

// ── useAuth outside provider ──────────────────────────────────────────────────

describe('useAuth outside AuthProvider', () => {
  test('throws an error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()

    function BareConsumer() {
      useAuth()
      return null
    }

    expect(() => render(<BareConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    )

    console.error = originalError
  })
})
