"use client";

/**
 * Notes Page — Full CRUD interface for managing notes
 *
 * Features:
 * - Create new note (modal form)
 * - View all notes (searchable, filterable grid)
 * - Edit existing notes
 * - Delete notes with confirmation
 *
 * TODO: All CRUD operations currently work on local state.
 * When the FastAPI backend is ready, the NotesContext will be updated
 * to dispatch API calls instead of local state mutations.
 */

import { useState, useEffect } from "react";
import { useNotes } from "@/context/NotesContext";
import NoteList from "@/components/notes/NoteList";
import NoteForm from "@/components/notes/NoteForm";
import Button from "@/components/ui/Button";

export default function NotesPage() {
  const { removeNote } = useNotes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [initialChapter, setInitialChapter] = useState("");

  // Deep-link from the chapter reader: /dashboard/notes?chapter=<title>
  // opens the create form with that chapter pre-selected.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chapter = params.get("chapter");
    if (chapter) {
      setInitialChapter(chapter);
      setEditingNote(null);
      setIsFormOpen(true);
      // clean the URL so a refresh doesn't reopen the form
      window.history.replaceState(null, "", "/dashboard/notes");
    }
  }, []);

  const handleCreateNote = () => {
    setEditingNote(null);
    setInitialChapter("");
    setIsFormOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>Notes</h1>
          </div>
          <p className="text-sm pl-10" style={{ color: "#94A3B8" }}>
            Create, manage, and organize your notes
          </p>
        </div>

        <Button onClick={handleCreateNote} size="md" id="create-note-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </Button>
      </div>

      {/* Notes List with Search & Filter */}
      <NoteList onEditNote={handleEditNote} />

      {/* Create/Edit Form Modal */}
      <NoteForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editNote={editingNote}
        initialChapter={initialChapter}
      />
    </div>
  );
}
