/**
 * Unit tests for src/lib/api.js
 *
 * fetch is mocked globally so no real HTTP calls are made.
 *
 * Test IDs covered:
 *   LG-01  loginTeacher — valid credentials returns success + user object
 *   LG-03  loginTeacher — API 401 with non-demo creds returns {success: false}
 *   LG-10  Demo credentials fallback when API is unreachable
 */

import { loginTeacher, logoutTeacher, fetchNotes, createNote, updateNote, deleteNote } from '@/lib/api'

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockFetchOk(body, status = 200) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status,
    json: async () => body,
  })
}

function mockFetchError(body, status = 401) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => body,
  })
}

function mockFetchNetworkFailure() {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'))
}

const VALID_LOGIN_RESPONSE = {
  access_token: 'eyJhbGciOiJIUzI1NiJ9.test.token',
  token_type: 'bearer',
  teacher_id: 1,
  name: 'Sandipani Acharya',
  email: 'sandipani.acharya@swais.edu',
  avatar_initials: 'SA',
  subject: 'Social Studies',
  class_assigned: '8',
  section: 'A',
  school_name: 'SGS School',
}

beforeEach(() => {
  // Reset localStorage before each test
  localStorage.clear()
  jest.clearAllMocks()
})

// ── loginTeacher ──────────────────────────────────────────────────────────────

describe('loginTeacher', () => {
  test('LG-01: valid credentials — returns success with user object', async () => {
    mockFetchOk(VALID_LOGIN_RESPONSE)
    const result = await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    expect(result.success).toBe(true)
    expect(result.user).toBeDefined()
    expect(result.user.name).toBe('Sandipani Acharya')
    expect(result.user.teacher_id).toBe(1)
  })

  test('LG-01: valid login stores JWT token in localStorage', async () => {
    mockFetchOk(VALID_LOGIN_RESPONSE)
    await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    expect(localStorage.getItem('swais_faculty_token')).toBe(VALID_LOGIN_RESPONSE.access_token)
  })

  test('LG-01: user id formatted as T00X', async () => {
    mockFetchOk(VALID_LOGIN_RESPONSE)
    const result = await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    expect(result.user.id).toBe('T001')
  })

  test('LG-01: user object contains all expected fields', async () => {
    mockFetchOk(VALID_LOGIN_RESPONSE)
    const result = await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    const user = result.user
    expect(user.name).toBe('Sandipani Acharya')
    expect(user.email).toBe('sandipani.acharya@swais.edu')
    expect(user.avatar).toBe('SA')
    expect(user.subject).toBe('Social Studies')
    expect(user.section).toBe('A')
  })

  test('LG-03: API 401 error with non-demo creds returns failure', async () => {
    mockFetchError({ detail: 'Invalid email or password' }, 401)
    const result = await loginTeacher('wrong@user.com', 'badpass')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  test('LG-03: failed login does not store token', async () => {
    mockFetchError({ detail: 'Invalid email or password' }, 401)
    await loginTeacher('wrong@user.com', 'badpass')
    expect(localStorage.getItem('swais_faculty_token')).toBeNull()
  })

  test('LG-10: network failure with demo credentials returns offline user', async () => {
    mockFetchNetworkFailure()
    const result = await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    expect(result.success).toBe(true)
    expect(result.user.name).toBe('Sandipani Acharya')
  })

  test('LG-10: network failure with demo creds stores offline token', async () => {
    mockFetchNetworkFailure()
    await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    expect(localStorage.getItem('swais_faculty_token')).toBe('offline-demo-token')
  })

  test('network failure with non-demo credentials returns failure', async () => {
    mockFetchNetworkFailure()
    const result = await loginTeacher('other@user.com', 'badpass')
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/demo credentials/i)
  })

  test('calls correct endpoint with POST method', async () => {
    mockFetchOk(VALID_LOGIN_RESPONSE)
    await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/login'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  test('sends email and password in request body', async () => {
    mockFetchOk(VALID_LOGIN_RESPONSE)
    await loginTeacher('sandipani.acharya@swais.edu', 'swais@123')
    const callArgs = fetch.mock.calls[0][1]
    const body = JSON.parse(callArgs.body)
    expect(body.email).toBe('sandipani.acharya@swais.edu')
    expect(body.password).toBe('swais@123')
  })
})

// ── logoutTeacher ─────────────────────────────────────────────────────────────

describe('logoutTeacher', () => {
  test('removes token from localStorage', async () => {
    localStorage.setItem('swais_faculty_token', 'some-token')
    mockFetchOk({ message: 'Logged out successfully' })
    await logoutTeacher()
    expect(localStorage.getItem('swais_faculty_token')).toBeNull()
  })

  test('removes token even if API call fails', async () => {
    localStorage.setItem('swais_faculty_token', 'some-token')
    mockFetchNetworkFailure()
    await logoutTeacher()
    expect(localStorage.getItem('swais_faculty_token')).toBeNull()
  })

  test('calls logout endpoint', async () => {
    mockFetchOk({ message: 'Logged out successfully' })
    await logoutTeacher()
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/logout'),
      expect.objectContaining({ method: 'POST' })
    )
  })
})

// ── fetchNotes ────────────────────────────────────────────────────────────────

describe('fetchNotes', () => {
  const MOCK_NOTES = [
    { id: 'N1', title: 'Fundamental Rights', chapter: 'Chapter 1', contentType: 'typed', tags: ['rights'], createdAt: '2026-05-20T00:00:00Z', updatedAt: '2026-05-20T00:00:00Z' },
    { id: 'N2', title: 'Secularism',         chapter: 'Chapter 2', contentType: 'typed', tags: [],         createdAt: '2026-05-18T00:00:00Z', updatedAt: '2026-05-18T00:00:00Z' },
    { id: 'N3', title: 'Parliament',          chapter: 'Chapter 3', contentType: 'typed', tags: [],         createdAt: '2026-05-15T00:00:00Z', updatedAt: '2026-05-15T00:00:00Z' },
  ]

  test('NT-01: returns array of notes from API', async () => {
    mockFetchOk({ notes: MOCK_NOTES, total: 3 })
    const notes = await fetchNotes()
    expect(Array.isArray(notes)).toBe(true)
    expect(notes).toHaveLength(3)
  })

  test('NT-01: first note has correct title', async () => {
    mockFetchOk({ notes: MOCK_NOTES, total: 3 })
    const notes = await fetchNotes()
    expect(notes[0].title).toBe('Fundamental Rights')
  })

  test('sends Authorization header with token', async () => {
    localStorage.setItem('swais_faculty_token', 'test-jwt-token')
    mockFetchOk({ notes: [], total: 0 })
    await fetchNotes()
    const headers = fetch.mock.calls[0][1].headers
    expect(headers.Authorization).toBe('Bearer test-jwt-token')
  })

  test('throws on API error', async () => {
    mockFetchError({ detail: 'Unauthorized' }, 401)
    await expect(fetchNotes()).rejects.toThrow()
  })
})

// ── createNote ────────────────────────────────────────────────────────────────

describe('createNote', () => {
  const CREATED_NOTE = {
    id: 'N4',
    title: 'New Note',
    chapter: 'Chapter 1',
    contentType: 'typed',
    tags: ['test'],
    createdAt: '2026-06-07T00:00:00Z',
    updatedAt: '2026-06-07T00:00:00Z',
  }

  test('NT-03: returns created note', async () => {
    mockFetchOk(CREATED_NOTE)
    const note = await createNote({ title: 'New Note', chapter: 'Chapter 1', contentType: 'typed' })
    expect(note.id).toBe('N4')
    expect(note.title).toBe('New Note')
  })

  test('NT-03: calls POST /api/v1/notes', async () => {
    mockFetchOk(CREATED_NOTE)
    await createNote({ title: 'Test', chapter: 'Chapter 1' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notes'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  test('sends correct fields in request body', async () => {
    mockFetchOk(CREATED_NOTE)
    await createNote({ title: 'Test', chapter: 'Chapter 1', contentType: 'typed', tags: ['a'] })
    const body = JSON.parse(fetch.mock.calls[0][1].body)
    expect(body.title).toBe('Test')
    expect(body.chapter).toBe('Chapter 1')
    expect(body.content_type).toBe('typed')
    expect(body.tags).toEqual(['a'])
  })
})

// ── updateNote ────────────────────────────────────────────────────────────────

describe('updateNote', () => {
  test('NT-12: strips N prefix from id in URL', async () => {
    mockFetchOk({ id: 'N2', title: 'Updated', chapter: 'Chapter 2', contentType: 'typed', tags: [], createdAt: '', updatedAt: '' })
    await updateNote('N2', { title: 'Updated' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notes/2'),
      expect.objectContaining({ method: 'PUT' })
    )
  })

  test('NT-12: also works with numeric id string', async () => {
    mockFetchOk({ id: 'N5', title: 'Updated', chapter: 'Chapter 1', contentType: 'typed', tags: [], createdAt: '', updatedAt: '' })
    await updateNote('5', { title: 'Updated' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notes/5'),
      expect.anything()
    )
  })
})

// ── deleteNote ────────────────────────────────────────────────────────────────

describe('deleteNote', () => {
  test('NT-13: calls DELETE with correct URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 204, json: async () => null })
    await deleteNote('N3')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/notes/3'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  test('NT-13: strips N prefix from id', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 204, json: async () => null })
    await deleteNote('N7')
    const url = fetch.mock.calls[0][0]
    expect(url).toContain('/api/v1/notes/7')
    expect(url).not.toContain('N7')
  })

  test('NT-13: returns success object', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 204, json: async () => null })
    const result = await deleteNote('N1')
    expect(result).toEqual({ success: true })
  })
})
