"use client";

/**
 * NoteList — Responsive grid of NoteCards with search and filter
 *
 * Features:
 * - Search by title or chapter
 * - Filter by chapter
 * - Empty state illustration
 * - Skeleton loading state
 * - Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
 */

import { useState, useMemo } from "react";
import { useNotes } from "@/context/NotesContext";
import { useToast } from "@/components/ui/Toast";
import NoteCard from "@/components/notes/NoteCard";
import SearchBar from "@/components/ui/SearchBar";

export default function NoteList({ onEditNote }) {
  const { notes, chapters, isLoading, removeNote } = useNotes();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  const handleDelete = async (id) => {
    try {
      await removeNote(id);
      toast.success("Note deleted successfully", "Deleted");
    } catch {
      toast.error("Could not delete note. Please try again.", "Error");
    }
  };

  // Filter notes based on search and chapter
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.chapter.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChapter =
        !selectedChapter || note.chapter === selectedChapter;

      return matchesSearch && matchesChapter;
    });
  }, [notes, searchQuery, selectedChapter]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="skeleton h-10 flex-1 rounded-lg" />
          <div className="skeleton h-10 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-card">
              <div className="skeleton h-5 w-3/4 mb-3" />
              <div className="skeleton h-6 w-32 mb-3 rounded-full" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-5/6 mb-2" />
              <div className="skeleton h-4 w-2/3 mb-4" />
              <div className="skeleton h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            placeholder="Search notes by title, content, or chapter..."
            value={searchQuery}
            onChange={setSearchQuery}
            id="notes-search"
          />
        </div>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 cursor-pointer"
          id="notes-chapter-filter"
        >
          <option value="">All Chapters</option>
          {chapters.map((chapter) => {
            const label = typeof chapter === "string" ? chapter : (chapter.content_title ?? chapter.chapter_name ?? String(chapter.chapter_id));
            const key   = typeof chapter === "string" ? chapter : chapter.chapter_id;
            return (
              <option key={key} value={label}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-light">
          Showing{" "}
          <span className="font-semibold text-text">{filteredNotes.length}</span>{" "}
          {filteredNotes.length === 1 ? "note" : "notes"}
          {(searchQuery || selectedChapter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedChapter("");
              }}
              className="ml-2 text-primary hover:text-secondary transition-colors text-xs font-medium cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* Notes Grid or Empty State */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEditNote}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-primary/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text mb-1">No notes found</h3>
          <p className="text-sm text-text-lighter max-w-xs">
            {searchQuery || selectedChapter
              ? "Try adjusting your search or filter criteria."
              : "Create your first note to get started!"}
          </p>
        </div>
      )}
    </div>
  );
}
