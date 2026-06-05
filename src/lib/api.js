"use client";

/**
 * ============================================================
 * API Integration Layer — SWAIS Faculty Module
 * ============================================================
 * All calls go to the FastAPI backend at NEXT_PUBLIC_API_BASE_URL.
 * JWT token is read from localStorage (set by AuthContext on login).
 * ============================================================
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const TOKEN_KEY = "swais_faculty_token";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  // 204 No Content — no body
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Authenticate teacher — POST /api/v1/auth/login
 * Stores JWT in localStorage on success.
 */
// Demo credentials accepted when the backend is unreachable
const DEMO_USER = {
  id:           "T016",
  teacher_id:   16,
  name:         "Sandipani Acharya",
  email:        "sandipani.acharya@swais.edu",
  avatar:       "SA",
  subject:      "Social Studies",
  class:        "8th Grade",
  section:      "A",
  school:       "SWAIS",
  totalStudents: 10,
};
const DEMO_EMAIL    = "sandipani.acharya@swais.edu";
const DEMO_PASSWORD = "swais@123";

export async function loginTeacher(email, password) {
  try {
    const data = await request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Persist token separately so request() can pick it up
    localStorage.setItem(TOKEN_KEY, data.access_token);

    // Build a user object matching what the rest of the frontend expects
    const user = {
      id: `T${String(data.teacher_id).padStart(3, "0")}`,
      teacher_id: data.teacher_id,
      name: data.name,
      email: data.email,
      avatar: data.avatar_initials || data.name.slice(0, 2).toUpperCase(),
      subject: data.subject,
      class: data.class_assigned,
      section: data.section,
      school: data.school_name,
      totalStudents: 10,
    };

    return { success: true, user };
  } catch (err) {
    // Network/API unreachable — allow demo credentials so the app is still usable
    if (
      email.trim().toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      // Store a placeholder token so guarded fetches don't short-circuit
      localStorage.setItem(TOKEN_KEY, "offline-demo-token");
      return { success: true, user: DEMO_USER };
    }
    return { success: false, error: "Unable to reach server. Use demo credentials to explore offline." };
  }
}

/**
 * Log out — POST /api/v1/auth/logout then clear local token.
 */
export async function logoutTeacher() {
  try {
    await request("/api/v1/auth/logout", { method: "POST" });
  } catch {
    /* ignore server errors on logout */
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// ── Notes ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all notes for the current teacher — GET /api/v1/notes
 */
export async function fetchNotes() {
  const data = await request("/api/v1/notes");
  return data.notes; // array of NoteOut
}

/**
 * Create a new note — POST /api/v1/notes
 */
export async function createNote(noteData) {
  return request("/api/v1/notes", {
    method: "POST",
    body: JSON.stringify({
      title: noteData.title,
      content: noteData.content || null,
      chapter: noteData.chapter,
      content_type: noteData.contentType || "typed",
      canvas_image_url: noteData.canvasImageUrl || null,
      tags: noteData.tags || [],
    }),
  });
}

/**
 * Update an existing note — PUT /api/v1/notes/:numericId
 * Accepts id in "N123" format (strips the "N" prefix).
 */
export async function updateNote(id, updates) {
  const numericId = String(id).replace(/^N/, "");
  return request(`/api/v1/notes/${numericId}`, {
    method: "PUT",
    body: JSON.stringify({
      title: updates.title,
      content: updates.content,
      chapter: updates.chapter,
      content_type: updates.contentType,
      canvas_image_url: updates.canvasImageUrl,
      tags: updates.tags,
    }),
  });
}

/**
 * Delete a note — DELETE /api/v1/notes/:numericId
 */
export async function deleteNote(id) {
  const numericId = String(id).replace(/^N/, "");
  await request(`/api/v1/notes/${numericId}`, { method: "DELETE" });
  return { success: true };
}

// ── Chapters ──────────────────────────────────────────────────────────────────

/**
 * Fetch chapter list — GET /api/v1/chapters
 */
export async function fetchChapters() {
  const data = await request("/api/v1/chapters");
  return data.chapters;
}

/**
 * Fetch teacher profile from stored login data (no extra API call needed).
 * Profile is already returned at login and stored in AuthContext.
 */
export async function fetchTeacherProfile() {
  // Profile already in localStorage via AuthContext — no need to re-fetch.
  return null;
}
