import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityIndicator } from "@/components/PriorityIndicator";
import { apiTickets } from "@/services/models/ticketsModel";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils/enumLabel";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import usePermissions from "@/hooks/usePermissions";

interface Ticket {
  _id: string;
  title: string;
  contact: string;
  email?: string;
  category?: string;
  priority: string;
  status: string;
  assignedTo?: string;
  description?: string;
  createdAt: string;
}

interface TicketPanelProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: Ticket) => void;
  onDelete: (id: string) => void;
}

const FIELDS: { key: keyof Ticket; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "category", label: "Category" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "description", label: "Description" },
];

const TicketPanel = ({ ticket, open, onClose, onUpdate, onDelete }: TicketPanelProps) => {
  const { has } = usePermissions();
  const { ticketStatuses, ticketPriorities } = useEnums();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Ticket>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = () => {
    if (!ticket) return;
    setForm({ ...ticket });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({});
  };

  const handleSave = async () => {
    if (!ticket) return;
    setSaving(true);
    const res = await apiTickets.putById!(ticket._id, form, new AbortController().signal, "", true);
    setSaving(false);
    if (res?._id) {
      toast.success("Ticket updated");
      onUpdate(res as Ticket);
      setEditing(false);
    } else {
      toast.error(res?.message ?? "Failed to update ticket");
    }
  };

  const handleDelete = async () => {
    if (!ticket || !confirm(`Delete "${ticket.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await apiTickets.remove!(ticket._id, "", true);
    setDeleting(false);
    toast.success("Ticket deleted");
    onDelete(ticket._id);
    onClose();
  };

  const set = (key: keyof Ticket, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (!ticket) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent title={ticket.title}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b">
          <div className="flex items-start justify-between pr-6 gap-2">
            <h2 className="text-base font-semibold leading-tight">{ticket.title}</h2>
            <div className="flex items-center gap-1 shrink-0">
              {editing ? (
                <>
                  <button
                    onClick={cancelEdit}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <Button size="sm" onClick={handleSave} loading={saving}>
                    <Save className="h-3.5 w-3.5 mr-1" /> Save
                  </Button>
                </>
              ) : (
                <>
                  {has("tickets-edit") && (
                    <button
                      onClick={startEdit}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {has("tickets-delete") && (
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status + Priority badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {editing ? (
              <>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {toLabelItems(ticketStatuses).map((i) => (
                    <option key={i.val} value={i.val}>{i.label}</option>
                  ))}
                </select>
                <select
                  value={form.priority}
                  onChange={(e) => set("priority", e.target.value)}
                  className="rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {toLabelItems(ticketPriorities).map((i) => (
                    <option key={i.val} value={i.val}>{i.label}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <StatusBadge value={ticket.status} />
                <PriorityIndicator value={ticket.priority} />
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Created {convertDateToDateWithoutTime(ticket.createdAt)}
          </p>
        </div>

        {/* Detail rows */}
        <div className="px-5 py-4 space-y-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
              {editing && key !== "createdAt" ? (
                key === "description" ? (
                  <textarea
                    rows={3}
                    value={(form[key] as string) ?? ""}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-full resize-none rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <input
                    type="text"
                    value={(form[key] as string) ?? ""}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                )
              ) : (
                <p className={cn("text-sm", !ticket[key] && "text-muted-foreground italic")}>
                  {(ticket[key] as string) || "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketPanel;
