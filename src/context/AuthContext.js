"use client";

/**
 * AuthContext — Mock Authentication Provider
 *
 * Manages login/logout state with localStorage persistence.
 * TODO: Replace with real JWT/session-based auth via FastAPI backend.
 *
 * Expected backend endpoints:
 *   POST /api/auth/login   — returns JWT token + user profile
 *   POST /api/auth/logout  — invalidates the session
 *   GET  /api/auth/me      — returns current user from token
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginTeacher, logoutTeacher } from "@/lib/api";

const AuthContext = createContext(undefined);

const STORAGE_KEY = "swais_faculty_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function restoreSession() {
      try {
        // 1. Check URL for ?token= param (staging.sgs.swais.in redirects here with token)
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        if (urlToken) {
          localStorage.setItem("swais_faculty_token", urlToken);
          // Clean token from URL without triggering a navigation
          const clean = window.location.pathname;
          window.history.replaceState({}, "", clean);
        }

        // 2. Check localStorage for an existing token or user profile
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
          return;
        }

        // 3. If a raw JWT exists (set by staging via URL param above or a prior session)
        //    call /api/v1/auth/me to get the user profile
        const token = localStorage.getItem("swais_faculty_token");
        if (token) {
          // Dev bypass: skip API call for local testing
          if (process.env.NODE_ENV === "development" && token === "dev") {
            const devUser = {
              id: "T001", teacher_id: 1, name: "Demo Teacher",
              email: "demo@swais.edu", avatar: "DT",
              subject: "Social Studies", class: "8", section: "A",
              school: "SWAIS", totalStudents: 10,
            };
            setUser(devUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(devUser));
            return;
          }
          const { fetchMe } = await import("@/lib/api");
          const profile = await fetchMe();
          if (profile) {
            setUser(profile);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("swais_faculty_token");
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  /**
   * Log in with email and password.
   * TODO: Replace with API call — POST /api/auth/login
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginTeacher(email, password);

      if (result.success) {
        setUser(result.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log out the current user — calls backend then clears local state.
   */
  const logout = useCallback(async () => {
    await logoutTeacher(); // clears TOKEN_KEY from localStorage
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
