import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiTickets } from "@/services/models/ticketsModel";
import { useEnums } from "@/hooks/useEnums";
import useUsers from "@/hooks/useUsers";
import { toLabelItems } from "@/utils";
import toast from "react-hot-toast";
import { ITicket } from "../types";

interface TicketPanelProps {
  ticket: ITicket | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: ITicket) => void;
  onDelete: (id: string) => void;
}

const TicketPanel = ({ ticket, open, onClose, onUpdate }: TicketPanelProps) => {
  const { ticketStatuses, ticketPriorities, ticketCategories } = useEnums();
  const { userItems } = useUsers();
  const [form, setForm] = useState<Partial<ITicket>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ticket || !open) return;
    setForm({ ...ticket });
  }, [ticket?._id, open]);

  const handleSave = async () => {
    if (!ticket) return;
    setSaving(true);
    const res = await apiTickets.putById!(
      ticket._id,
      form,
      new AbortController().signal,
      "",
      true,
    );
    setSaving(false);
    if (res?._id) {
      toast.success("Ticket updated");
      onUpdate(res as ITicket);
      onClose();
    } else {
      toast.error(res?.message ?? "Failed to update ticket");
    }
  };

  const set = (key: keyof ITicket, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (!ticket) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent title={ticket.title} className="flex flex-col">
        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                className="text-sm"
                value={(form.title as string) ?? ""}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>

            {/* Status / Priority / Category */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toLabelItems(ticketStatuses).map((i) => (
                      <SelectItem key={i.val} value={i.val} className="text-xs">
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => set("priority", v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toLabelItems(ticketPriorities).map((i) => (
                      <SelectItem key={i.val} value={i.val} className="text-xs">
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select
                  value={form.category ?? ""}
                  onValueChange={(v) => set("category", v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {toLabelItems(ticketCategories).map((i) => (
                      <SelectItem key={i.val} value={i.val} className="text-xs">
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact / Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Contact</Label>
                <Input
                  className="h-8 text-sm"
                  value={(form.contact as string) ?? ""}
                  onChange={(e) => set("contact", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  className="h-8 text-sm"
                  value={(form.email as string) ?? ""}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>

            {/* Assigned To */}
            <div className="space-y-1.5">
              <Label className="text-xs">Assigned To</Label>
              <Select
                value={form.assignedTo || "__none__"}
                onValueChange={(v) =>
                  set("assignedTo", v === "__none__" ? "" : v)
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Unassigned</SelectItem>
                  {userItems.map((u) => (
                    <SelectItem key={u.val} value={u.val}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                rows={4}
                className="text-sm resize-none"
                value={(form.description as string) ?? ""}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-t shrink-0 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketPanel;
