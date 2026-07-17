"use client";

/**
 * NoteCard — Individual note display card
 *
 * Additions over original:
 *  - Content-type badge  (🎤 Voice / ✏️ Handwritten / ⌨️ Typed)
 *  - Canvas image preview for handwritten notes
 *  - 🔊 Listen button  — reads `note.content` aloud via Web Speech API
 *    (placeholder for AWS Polly when backend is ready)
 */

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

// ── Content-type config ────────────────────────────────────────────────────
const TYPE_META = {
  voice:       { icon: "🎤", label: "Voice",       cls: "bg-primary-light text-primary" },
  handwritten: { icon: "✏️",  label: "Handwritten", cls: "bg-accent-light   text-accent"   },
  typed:       { icon: "⌨️",  label: "Typed",       cls: "bg-bg            text-text-light" },
};

export default function NoteCard({ note, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSpeaking, setIsSpeaking]               = useState(false);
  const [ttsSupported, setTtsSupported]            = useState(false);

  // Check TTS support once on mount
  useEffect(() => {
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Stop speaking when card unmounts
  useEffect(() => {
    return () => { if (isSpeaking) window.speechSynthesis?.cancel(); };
  }, [isSpeaking]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  const getExcerpt = (text = "", max = 150) =>
    text.length <= max ? text : text.substring(0, max).trim() + "…";

  const handleDelete = () => {
    onDelete(note.id);
    setShowDeleteConfirm(false);
  };

  // ── Listen / Stop ─────────────────────────────────────────────────────────
  const handleListen = () => {
    if (!ttsSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = note.content?.trim();
    if (!text) return;

    const utterance     = new SpeechSynthesisUtterance(text);
    utterance.lang      = "en-IN";
    utterance.rate      = 0.9;
    utterance.pitch     = 1;
    utterance.onend     = () => setIsSpeaking(false);
    utterance.onerror   = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel(); // stop anything already playing
    window.speechSynthesis.speak(utterance);
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const typeMeta    = TYPE_META[note.contentType] ?? TYPE_META.typed;
  const hasCanvas   = !!note.canvasImageUrl;
  const hasText     = !!note.content?.trim();
  const canListen   = ttsSupported && hasText;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="group bg-white rounded-xl border-l-4 border-accent shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">

      {/* ── Handwritten canvas preview ── */}
      {hasCanvas && (
        <div className="relative border-b border-border overflow-hidden bg-[#fdfdf5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={note.canvasImageUrl}
            alt={`Handwritten note: ${note.title}`}
            className="w-full object-cover max-h-40"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/80 backdrop-blur-sm
            rounded-full text-[10px] font-medium text-text-light border border-border/50">
            ✏️ Handwritten
          </div>
        </div>
      )}

      {/* ── Card body ── */}
      <div className="p-5">

        {/* Header: title */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="flex-1 text-base font-bold text-text leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {note.title}
          </h3>
        </div>

        {/* Badges row: chapter + content type */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {/* Chapter badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-light text-accent text-xs font-medium rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {note.chapter}
          </span>

          {/* Content-type badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${typeMeta.cls}`}>
            <span>{typeMeta.icon}</span>
            {typeMeta.label}
          </span>
        </div>

        {/* Content excerpt — show only if there is text */}
        {hasText ? (
          <p className="text-sm text-text-light leading-relaxed mb-4">
            {getExcerpt(note.content)}
          </p>
        ) : (
          <p className="text-sm text-text-lighter italic mb-4">
            No text — see drawing above.
          </p>
        )}

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.map((tag) => (
              <span key={tag}
                className="px-2 py-0.5 bg-primary-light text-primary text-[11px] font-medium rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: date + listen + edit/delete */}
        <div className="flex items-center justify-between pt-3 border-t border-border gap-2 flex-wrap">

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-text-lighter">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(note.updatedAt)}
            {note.createdAt !== note.updatedAt && (
              <span className="text-text-lighter/70">(edited)</span>
            )}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-1">

            {/* View — mobile only (hover-only edit/delete aren't reachable on touch) */}
            <button
              onClick={() => onEdit(note)}
              className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary-light text-primary"
              aria-label={`View note: ${note.title}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View
            </button>

            {/* 🔊 Listen button */}
            {canListen && (
              <button
                onClick={handleListen}
                aria-label={isSpeaking ? "Stop reading" : "Read note aloud"}
                title={isSpeaking ? "Stop" : "Listen"}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  transition-all duration-200
                  ${isSpeaking
                    ? "bg-danger text-white"
                    : "bg-accent-light text-accent hover:bg-accent hover:text-white"}`}
              >
                {isSpeaking ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M9.172 16.172a4 4 0 010-5.656" />
                    </svg>
                    Listen
                  </>
                )}
              </button>
            )}

            {/* Edit / Delete — always visible (mobile shows only Delete; View handles opening) */}
            {!showDeleteConfirm ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(note)}
                  className="hidden md:inline-flex p-1.5 rounded-lg text-text-lighter hover:text-primary hover:bg-primary-light transition-all duration-200"
                  aria-label={`Edit note: ${note.title}`}
                  title="Edit note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 rounded-lg text-text-lighter hover:text-danger hover:bg-danger-light transition-all duration-200"
                  aria-label={`Delete note: ${note.title}`}
                  title="Delete note"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 animate-scale-in">
                <span className="text-xs text-danger font-medium">Delete?</span>
                <Button size="sm" variant="danger" onClick={handleDelete}>Yes</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)}>No</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
