"use client";

/**
 * Chapters Page — lists the available chapters for the teacher.
 * Clicking a chapter opens the reading view (/dashboard/chapters/[id]),
 * where the full chapter text can be read and notes can be written.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchChapters } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ChaptersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setChapters([]); setIsLoading(false); return; }
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchChapters();
        setChapters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Chapters API error:", err.message);
        setChapters([]);
        setError(err.message || "Unable to load chapters.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user, authLoading]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>Chapters</h1>
        </div>
        <p className="text-sm pl-10" style={{ color: "#94A3B8" }}>
          Read the full chapter and write notes
        </p>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white animate-pulse" style={{ border: "1px solid rgba(99,102,241,0.1)" }} />
          ))}
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl" style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
          <div className="w-16 h-16 rounded-2xl ai-gradient flex items-center justify-center mx-auto mb-4 opacity-40">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: "#94A3B8" }}>
            {error ? "Chapters not available right now." : "No chapters found."}
          </p>
          <p className="text-xs mt-1" style={{ color: "#CBD5E1" }}>
            {error ? "Please try again shortly." : "Chapters added by the school will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((ch) => {
            const title = ch.content_title || ch.chapter_name || `Chapter ${ch.chapter_id}`;
            return (
              <Link
                key={ch.chapter_id}
                href={`/dashboard/chapters/${ch.chapter_id}`}
                className="group flex flex-col justify-between gap-4 p-5 rounded-2xl bg-white transition-all"
                style={{ border: "1px solid rgba(99,102,241,0.1)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl ai-gradient flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug" style={{ color: "#0F172A" }}>{title}</p>
                    {ch.chapter_name && ch.content_title && ch.chapter_name !== ch.content_title && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "#94A3B8" }}>{ch.chapter_name}</p>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold self-start px-3 py-1.5 rounded-lg"
                  style={{ background: "#EEF2FF", color: "#6366F1" }}>
                  Read chapter
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
