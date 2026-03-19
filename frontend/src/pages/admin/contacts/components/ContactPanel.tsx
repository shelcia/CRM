import React, { useEffect, useState } from "react";
import usePermissions from "@/hooks/usePermissions";
import { Phone, Mail } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { apiProvider } from "@/services/utilities/provider";
import { apiContacts } from "@/services/models/contactsModel";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { IContact, INote, Tab } from "../types";
import ActivityTimeline from "./ActivityTimeline";
import Notes from "./Notes";
import DealsTab from "./Deals";
import Edit from "./Edit";

interface ContactPanelProps {
  contact: IContact | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: IContact) => void;
  onDelete: (id: string) => void;
  defaultTab?: Tab;
}

const initForm = (c: IContact) => ({
  name: c.name ?? "",
  email: c.email ?? "",
  number: c.number ?? "",
  company: c.company ?? "",
  jobTitle: c.jobTitle ?? "",
  companySize: String(c.companySize ?? ""),
  probability: c.probability ?? "",
  status: c.status ?? "",
  priority: c.priority ?? "",
});

const ContactPanel = ({
  contact,
  open,
  onClose,
  onUpdate,
  onDelete,
  defaultTab = "edit",
}: ContactPanelProps) => {
  const { has } = usePermissions();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [notes, setNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof initForm>>(() =>
    contact ? initForm(contact) : initForm({} as IContact),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!contact?._id || !open) return;
    setNotes([]);
    setTab(defaultTab);
    setForm(initForm(contact));
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

  const set = (field: keyof ReturnType<typeof initForm>, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!contact) return;
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const res = await apiContacts.putById!(
      contact._id,
      form,
      new AbortController().signal,
      "",
      true,
    );
    setSaving(false);
    if (res?._id) {
      toast.success("Contact updated");
      onUpdate(res as IContact);
      onClose();
    } else {
      toast.error(res?.message ?? "Failed to update contact");
    }
  };

  if (!contact) return null;

  const TABS: { key: Tab; label: string }[] = [
    { key: "activity", label: "Activity" },
    { key: "notes", label: "Notes" },
    { key: "deals", label: "Deals" },
    ...(has("contacts-edit") ? [{ key: "edit" as Tab, label: "Edit" }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent title={contact.name} className="flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-start pr-6">
            <div>
              <h2 className="text-base font-semibold truncate">
                {contact.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {contact.jobTitle || contact.company}
              </p>
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
        <div className="flex border-b shrink-0">
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
            <Notes
              contactId={contact._id}
              notes={notes}
              onAdd={(note) => setNotes((prev) => [note, ...prev])}
              onDelete={(id) =>
                setNotes((prev) => prev.filter((n) => n._id !== id))
              }
            />
          ) : tab === "deals" ? (
            <DealsTab contact={contact} />
          ) : (
            <Edit form={form} set={set} />
          )}
        </div>

        {/* Footer — only shown on edit tab */}
        {tab === "edit" && (
          <div className="px-5 py-4 border-t shrink-0 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ContactPanel;
