import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/custom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { apiEmailGroups } from "@/services/models/emailGroupsModel";
import { apiContacts } from "@/services/models/contactsModel";
import { EmailGroup } from "../types";

interface Contact {
  _id: string;
  name: string;
  email: string;
}

interface GroupDialogProps {
  group?: EmailGroup;
  onSaved: (g: EmailGroup) => void;
  trigger: React.ReactNode;
}

const GroupDialog = ({ group, onSaved, trigger }: GroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(group?.contactIds ?? []),
  );
  const [nameError, setNameError] = useState("");

  const handleOpen = (v: boolean) => {
    setOpen(v);
    if (v) {
      setName(group?.name ?? "");
      setDescription(group?.description ?? "");
      setSelectedIds(new Set(group?.contactIds ?? []));
      setNameError("");
      setSearch("");
      setLoadingContacts(true);
      apiContacts.getByParams!(
        { limit: 500 },
        new AbortController().signal,
        "",
        true,
      ).then((res) => {
        if (res?.data) setContacts(res.data);
        setLoadingContacts(false);
      });
    }
  };

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      contactIds: [...selectedIds],
    };
    const res = group?._id
      ? await apiEmailGroups.putById!(
          group._id,
          payload,
          new AbortController().signal,
          "",
          true,
        )
      : await apiEmailGroups.post!(payload, "", true);
    setSaving(false);
    if (res?._id) {
      toast.success(group?._id ? "Group updated" : "Group created");
      onSaved(res as EmailGroup);
      setOpen(false);
    } else {
      toast.error(res?.message ?? "Failed to save group");
    }
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <CustomModal
      open={open}
      onOpenChange={handleOpen}
      title={group ? "Edit Group" : "New Email Group"}
      trigger={trigger}
      size="lg"
    >
      <div className="space-y-4 pt-1">
        <FormField
          label="Group Name"
          placeholder="ex: Qualified Leads"
          value={name}
          onChange={(v) => { setName(v); setNameError(""); }}
          error={nameError}
        />
        <div className="space-y-1">
          <Label htmlFor="gdesc">
            Description{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="gdesc"
            placeholder="What contacts does this group target?"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Contacts</Label>
            <span className="text-xs text-muted-foreground">
              {selectedIds.size} selected
            </span>
          </div>
          <Input
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
          <div className="border rounded-md overflow-y-auto max-h-52">
            {loadingContacts ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                Loading contacts…
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No contacts found
              </p>
            ) : (
              filtered.map((c) => (
                <label
                  key={c._id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer border-b last:border-0"
                >
                  <Checkbox
                    checked={selectedIds.has(c._id)}
                    onCheckedChange={() => toggle(c._id)}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.email}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {group ? "Save Changes" : "Create Group"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default GroupDialog;
