"use client";

/**
 * ConfirmDialog — application-styled replacement for window.confirm().
 *
 * Usage:
 *   const [pending, setPending] = useState(null);      // the thing to act on
 *   <ConfirmDialog
 *     isOpen={!!pending}
 *     title="Remove file?"
 *     message={`"${pending?.name}" stays recoverable until year end.`}
 *     confirmLabel="Remove"
 *     danger
 *     busy={busy}
 *     onConfirm={() => doIt(pending)}
 *     onCancel={() => setPending(null)}
 *   />
 *
 * Built on Modal, so it inherits backdrop, Escape-to-close and focus handling.
 * `danger` colours the confirm button red for destructive actions.
 */

import Modal from "./Modal";

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} onClose={busy ? () => {} : onCancel} maxWidth="max-w-md">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: danger ? "#FEF2F2" : "#EEF2FF" }}
            aria-hidden="true"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke={danger ? "#DC2626" : "#6366F1"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              {danger
                ? <path d="M19 7l-.9 12.1A2 2 0 0116.1 21H7.9a2 2 0 01-2-1.9L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
                : <path d="M12 9v4m0 4h.01M10.3 3.9L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />}
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="modal-title" className="text-base font-bold" style={{ color: "#0F172A" }}>{title}</h2>
            {message && (
              <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line" style={{ color: "#64748B" }}>{message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ border: "1.5px solid #E2E8F0", color: "#334155", background: "white" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            autoFocus
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            style={{ background: danger ? "#DC2626" : "#6366F1" }}
          >
            {busy && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
