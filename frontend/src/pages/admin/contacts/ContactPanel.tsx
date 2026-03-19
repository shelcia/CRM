import React, { useEffect, useRef, useState } from "react";
import usePermissions from "@/hooks/usePermissions";
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Activity,
  Trash2,
  Send,
  Pencil,
  Kanban,
  Plus,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { apiProvider } from "@/services/utilities/provider";
import { apiContacts } from "@/services/models/contactsModel";
import { getDealsByContact } from "@/services/models/dealsModel";
import { AddDealDialog, type Deal } from "@/pages/admin/pipeline/Pipeline";
import { cn } from "@/lib/utils";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils/enumLabel";
import toast from "react-hot-toast";

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
  companySize?: number;
  probability?: string;
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

// ── Deals Tab ─────────────────────────────────────────────────────────────────

const STAGE_DOT: Record<string, string> = {
  lead: "bg-slate-400",
  qualified: "bg-blue-500",
  proposal: "bg-amber-500",
  negotiation: "bg-orange-500",
  won: "bg-primary",
  lost: "bg-red-500",
};

const DealsTab = ({ contact }: { contact: Contact }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDealsByContact(contact._id).then((res) => {
      if (Array.isArray(res)) setDeals(res);
      setLoading(false);
    });
  }, [contact._id]);

  const totalValue = deals
    .filter((d) => d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);

  const fmtVal = (v: number, c: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: c, maximumFractionDigits: 0 }).format(v);

  if (loading) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {deals.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {deals.length} deal{deals.length !== 1 ? "s" : ""} · {fmtVal(totalValue, "USD")} pipeline
          </p>
        )}
        <AddDealDialog
          defaultContactId={contact._id}
          defaultContactName={contact.name}
          onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
          trigger={
            <Button size="sm" variant="outline" className="ml-auto">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Deal
            </Button>
          }
        />
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-muted-foreground gap-2">
          <Kanban className="h-8 w-8 opacity-30" />
          <p className="text-sm">No deals yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {deals.map((deal) => (
            <li key={deal._id} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug">{deal.title}</p>
                <span className="text-sm font-semibold text-primary shrink-0">
                  {fmtVal(deal.value, deal.currency)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={cn("h-2 w-2 rounded-full shrink-0", STAGE_DOT[deal.stage] ?? "bg-muted")} />
                <span className="text-xs text-muted-foreground capitalize">{deal.stage}</span>
                {deal.expectedClose && (
                  <>
                    <span className="text-muted-foreground/40 text-xs">·</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(deal.expectedClose).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── Edit Tab ───────────────────────────────────────────────────────────────────

const EditTab = ({
  contact,
  onSave,
}: {
  contact: Contact;
  onSave: (updated: Contact) => void;
}) => {
  const { contactStatuses, contactPriorities } = useEnums();
  const [form, setForm] = useState({
    name: contact.name ?? "",
    email: contact.email ?? "",
    number: contact.number ?? "",
    company: contact.company ?? "",
    jobTitle: contact.jobTitle ?? "",
    companySize: String(contact.companySize ?? ""),
    probability: contact.probability ?? "",
    status: contact.status ?? "",
    priority: contact.priority ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const res = await apiContacts.putById!(contact._id, form, new AbortController().signal, "", true);
    setSaving(false);
    if (res?._id) {
      toast.success("Contact updated");
      onSave(res as Contact);
    } else {
      toast.error(res?.message ?? "Failed to update contact");
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );

  const select = (label: string, key: keyof typeof form, items: { val: string; label: string }[]) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {items.map((i) => (
          <option key={i.val} value={i.val}>{i.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3">
        {field("Full Name", "name")}
        {field("Email", "email", "email")}
        {field("Phone", "number")}
        {field("Company", "company")}
        {field("Job Title", "jobTitle")}
        {field("Company Size", "companySize", "number")}
        {field("Probability (0–1)", "probability")}
        {select("Status", "status", toLabelItems(contactStatuses))}
        {select("Priority", "priority", toLabelItems(contactPriorities))}
      </div>
      <div className="flex justify-end pt-1">
        <Button size="sm" onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

// ── Contact Panel ──────────────────────────────────────────────────────────────

type Tab = "activity" | "notes" | "deals" | "edit";

interface ContactPanelProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: Contact) => void;
  onDelete: (id: string) => void;
}

const ContactPanel = ({ contact, open, onClose, onUpdate, onDelete }: ContactPanelProps) => {
  const { has } = usePermissions();
  const [tab, setTab] = useState<Tab>("activity");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!contact?._id || !open) return;
    setNotes([]);
    setTab("activity");
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

  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Delete <strong>{contact.name}</strong>?</p>
          <p className="text-xs text-muted-foreground">This cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-xs rounded-md border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setDeleting(true);
                const res = await apiContacts.remove!(contact._id, "", true);
                setDeleting(false);
                if (res?.deleted || res?._id || res?.message === undefined) {
                  toast.success("Contact deleted");
                  onDelete(contact._id);
                  onClose();
                } else {
                  toast.error("Failed to delete contact");
                }
              }}
              className="px-3 py-1 text-xs rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "activity", label: "Activity" },
    { key: "notes", label: "Notes" },
    { key: "deals", label: "Deals" },
    ...(has("contacts-edit") ? [{ key: "edit" as Tab, label: "Edit" }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent title={contact.name}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b">
          <div className="flex items-start justify-between pr-6">
            <div>
              <h2 className="text-base font-semibold truncate">{contact.name}</h2>
              <p className="text-sm text-muted-foreground truncate">{contact.jobTitle || contact.company}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {has("contacts-edit") && (
                <button
                  onClick={() => setTab("edit")}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit contact"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {has("contacts-delete") && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete contact"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
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
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors border-b-2",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
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
          ) : tab === "notes" ? (
            <NotesTab
              contactId={contact._id}
              notes={notes}
              onAdd={(note) => setNotes((prev) => [note, ...prev])}
              onDelete={(id) => setNotes((prev) => prev.filter((n) => n._id !== id))}
            />
          ) : tab === "deals" ? (
            <DealsTab contact={contact} />
          ) : (
            <EditTab
              contact={contact}
              onSave={(updated) => {
                onUpdate(updated);
                setTab("activity");
              }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ContactPanel;
