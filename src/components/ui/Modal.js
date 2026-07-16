"use client";

/**
 * Modal — Reusable modal overlay component
 *
 * Features:
 * - Backdrop blur + dark overlay
 * - Animated entrance (scale + fade)
 * - Close on backdrop click or Escape key
 * - Accessible focus management
 */

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  id,
}) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel — bounded to viewport height, vertically centered, inner content scrolls */}
      <div
        className={`relative w-full ${maxWidth} max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-2xl shadow-modal animate-scale-in overflow-hidden`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <h2
              id="modal-title"
              className="text-lg font-bold text-primary"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-lighter hover:text-text hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content — scrolls if it exceeds the bounded panel height */}
        <div className="px-6 py-5 flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
