"use client";

/**
 * NotesView — the notes list + create/edit form (used inside the tabbed page).
 * The "New Note" action and the NoteForm modal live here.
 */

import { useState } from "react";
import NoteList from "@/components/notes/NoteList";
import NoteForm from "@/components/notes/NoteForm";
import Button from "@/components/ui/Button";

export default function NotesView() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleCreateNote = () => {
    setEditingNote(null);
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateNote} size="md" id="create-note-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </Button>
      </div>

      <NoteList onEditNote={handleEditNote} />

      <NoteForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editNote={editingNote}
      />
    </div>
  );
}
