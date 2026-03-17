"use client";

import { useState } from "react";
import { StickyNote, Plus, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { ClientNote } from "@/lib/types";

interface ClientNotesPanelProps {
  clientId: string;
  adminId: string;
  initialNotes: (ClientNote & { admin?: { full_name: string } })[];
}

export default function ClientNotesPanel({
  clientId,
  adminId,
  initialNotes,
}: ClientNotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote.trim(), admin_id: adminId }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes([data.note, ...notes]);
        setNewNote("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm("Delete this note?")) return;
    const res = await fetch(`/api/clients/${clientId}/notes/${noteId}`, { method: "DELETE" });
    if (res.ok) {
      setNotes(notes.filter((n) => n.id !== noteId));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-50">
        <StickyNote className="w-5 h-5 text-[#c9a84c]" />
        <h2 className="font-bold text-[#0b1d3a]">
          Internal Notes ({notes.length})
        </h2>
        <span className="text-xs text-slate-400 ml-1">— Not visible to client</span>
      </div>

      <div className="p-5">
        {/* Add note */}
        <div className="mb-5">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add an internal note about this client..."
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAdd}
              disabled={!newNote.trim() || saving}
              className="flex items-center gap-2 bg-[#0b1d3a] hover:bg-[#1a2f5e] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add Note
            </button>
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">
              No notes yet. Add a note above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 relative group"
              >
                <p className="text-slate-700 text-sm leading-relaxed">{note.note}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-slate-400 text-xs">
                    {note.admin?.full_name ?? "Admin"} · {formatDateTime(note.created_at)}
                  </p>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
