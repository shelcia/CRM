import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Activity,
  Trash2,
  Send,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { apiProvider } from "@/services/utilities/provider";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type NoteType = "note" | "call" | "email" | "meeting" | "activity";

interface Note {
  _id: string;
  type: NoteType;
  body: string;
  author: string;
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  number: string;
  company: string;
  status: string;
  lastActivity: string;
  createdAt: string;
  jobTitle?: string;
  priority?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const NOTE_TYPE_META: Record<NoteType, { icon: React.ReactNode; label: string; color: string }> = {
  note: {
    icon: <MessageSquare className="h-3.5 w-3.5" />,
    label: "Note",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  call: {
    icon: <Phone className="h-3.5 w-3.5" />,
    label: "Call",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  email: {
    icon: <Mail className="h-3.5 w-3.5" />,
    label: "Email",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  meeting: {
    icon: <Calendar className="h-3.5 w-3.5" />,
    label: "Meeting",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  activity: {
    icon: <Activity className="h-3.5 w-3.5" />,
    label: "Activity",
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
};

function fmt(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Activity Timeline ──────────────────────────────────────────────────────────

const ActivityTimeline = ({ notes }: { notes: Note[] }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
        <Activity className="h-8 w-8 opacity-30" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <ol className="relative border-l border-border ml-3 space-y-0">
      {notes.map((note) => {
        const meta = NOTE_TYPE_META[note.type] ?? NOTE_TYPE_META.note;
        return (
          <li key={note._id} className="mb-6 ml-5">
            {/* dot */}
            <span className="absolute -left-[9px] flex items-center justify-center w-[18px] h-[18px] rounded-full bg-card border-2 border-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </span>

            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium shrink-0",
                  meta.color,
                )}
              >
                {meta.icon}
                {meta.label}
              </span>
              <time className="text-xs text-muted-foreground mt-0.5">{fmt(note.createdAt)}</time>
            </div>

            <p className="mt-1.5 text-sm text-foreground leading-relaxed">{note.body}</p>
            {note.author && (
              <p className="mt-0.5 text-xs text-muted-foreground">by {note.author}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
};

// ── Notes Tab ──────────────────────────────────────────────────────────────────

const NOTE_TYPES: NoteType[] = ["note", "call", "email", "meeting"];

const NotesTab = ({
  contactId,
  notes,
  onAdd,
  onDelete,
}: {
  contactId: string;
  notes: Note[];
  onAdd: (note: Note) => void;
  onDelete: (id: string) => void;
}) => {
  const [type, setType] = useState<NoteType>("note");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = async () => {
    if (!body.trim()) return;
    setSaving(true);
    const controller = new AbortController();
    const res = await apiProvider.post(
      "contacts",
      { type, body: body.trim() },
      `${contactId}/notes`,
      true,
    );
    setSaving(false);
    if (res?._id) {
      onAdd(res as Note);
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
      {/* Compose */}
      <div className="rounded-lg border bg-muted/30 p-3 flex flex-col gap-2">
        {/* Type selector */}
        <div className="flex gap-1.5 flex-wrap">
          {NOTE_TYPES.map((t) => {
            const meta = NOTE_TYPE_META[t];
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
                  type === t ? meta.color : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                {meta.icon}
                {meta.label}
              </button>
            );
          })}
        </div>

        <textarea
          ref={textareaRef}
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder={`Add a ${type}…`}
          className="w-full resize-none rounded-md border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="flex justify-end">
          <Button size="sm" onClick={submit} loading={saving} disabled={!body.trim()}>
            <Send className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* List */}
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
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{note.body}</p>
                <div className="flex items-center justify-between mt-2">
                  {note.author && (
                    <span className="text-xs text-muted-foreground">by {note.author}</span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">{fmt(note.createdAt)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ── Contact Panel ──────────────────────────────────────────────────────────────

type Tab = "activity" | "notes";

interface ContactPanelProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
}

const ContactPanel = ({ contact, open, onClose }: ContactPanelProps) => {
  const [tab, setTab] = useState<Tab>("activity");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contact?._id || !open) return;
    setNotes([]);
    setLoading(true);
    const controller = new AbortController();
    apiProvider
      .getAll(`contacts/${contact._id}/notes`, controller.signal, true)
      .then((res) => {
        if (Array.isArray(res)) setNotes(res);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [contact?._id, open]);

  if (!contact) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent title={contact.name}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b">
          <div className="pr-6">
            <h2 className="text-base font-semibold truncate">{contact.name}</h2>
            <p className="text-sm text-muted-foreground truncate">{contact.jobTitle || contact.company}</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
            {contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {contact.email}
              </span>
            )}
            {contact.number && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {contact.number}
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              {contact.status}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(["activity", "notes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium capitalize transition-colors border-b-2",
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "activity" ? "Activity Log" : "Notes"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              Loading…
            </div>
          ) : tab === "activity" ? (
            <ActivityTimeline notes={notes} />
          ) : (
            <NotesTab
              contactId={contact._id}
              notes={notes}
              onAdd={(note) => setNotes((prev) => [note, ...prev])}
              onDelete={(id) => setNotes((prev) => prev.filter((n) => n._id !== id))}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ContactPanel;
