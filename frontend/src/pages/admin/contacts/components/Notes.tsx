import { useRef, useState } from "react";
import { INote, NoteType } from "../types";
import { apiProvider } from "@/services/utilities/provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { convertDateToDateWithTime } from "@/utils/calendarHelpers";
import { Textarea } from "@/components/ui/textarea";
import { NOTE_TYPE_META, NOTE_TYPES } from "../constants";

interface NotesProps {
  contactId: string;
  notes: INote[];
  onAdd: (note: INote) => void;
  onDelete: (id: string) => void;
}

const Notes = ({ contactId, notes, onAdd, onDelete }: NotesProps) => {
  const [type, setType] = useState<NoteType>("note");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = async () => {
    if (!body.trim()) return;
    setSaving(true);
    const res = await apiProvider.post(
      "contacts",
      { type, body: body.trim() },
      `${contactId}/notes`,
      true,
    );
    setSaving(false);
    if (res?._id) {
      onAdd(res as INote);
      setBody("");
    }
  };

  const handleDelete = async (noteId: string) => {
    await apiProvider.remove("contacts", noteId, `${contactId}/notes`, true);
    onDelete(noteId);
  };

  const manualNotes = notes.filter((n) => n.type !== "activity");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border bg-muted/30 p-3 flex flex-col gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {NOTE_TYPES.map((t) => {
            const meta = NOTE_TYPE_META[t];
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
                  type === t
                    ? meta.color
                    : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                {meta.icon}
                {meta.label}
              </button>
            );
          })}
        </div>
        <Textarea
          ref={textareaRef}
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder={`Add a ${type}…`}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={submit}
            loading={saving}
            disabled={!body.trim()}
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {manualNotes.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-muted-foreground gap-2">
          <MessageSquare className="h-8 w-8 opacity-30" />
          <p className="text-sm">No notes yet</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {manualNotes.map((note) => {
            const meta = NOTE_TYPE_META[note.type] ?? NOTE_TYPE_META.note;
            return (
              <li key={note._id} className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium",
                      meta.color,
                    )}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleDelete(note._id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {note.body}
                </p>
                <div className="flex items-center justify-between mt-2">
                  {note.author && (
                    <span className="text-xs text-muted-foreground">
                      by {note.author}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {convertDateToDateWithTime(note.createdAt)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notes;
