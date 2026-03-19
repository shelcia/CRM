import { useEffect, useState } from "react";
import { Plus, Mail, Clock, Pencil, Trash2, CalendarClock, Users } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { SerializedEditorState } from "lexical";
import CustomTable from "@/components/CustomTable";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CustomTextField,
  CustomSelectField,
} from "@/components/CustomInputs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/blocks/editor-00/editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { apiEmailTemplates } from "@/services/models/emailTemplatesModel";
import { apiEmailGroups } from "@/services/models/emailGroupsModel";
import { apiContacts } from "@/services/models/contactsModel";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils/enumLabel";
import { confirmToast } from "@/utils/confirmToast";

// ─── Types ────────────────────────────────────────────────────────────────────

type Frequency = "one-time" | "daily" | "weekly" | "monthly";
type Status = "active" | "draft" | "paused";

interface EmailGroup {
  _id: string;
  name: string;
  description: string;
  contactIds: string[];
}

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  recipient: string;
  frequency: Frequency;
  sendDate: string;
  sendTime: string;
  dayOfWeek: string;
  dayOfMonth: string;
  status: Status;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const frequencyLabel: Record<Frequency, string> = {
  "one-time": "One-time",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const statusStyles: Record<Status, string> = {
  active: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

const scheduleLabel = (t: EmailTemplate) => {
  if (t.frequency === "one-time") return `${t.sendDate} at ${t.sendTime}`;
  if (t.frequency === "daily") return `Daily at ${t.sendTime}`;
  if (t.frequency === "weekly") {
    const day = t.dayOfWeek
      ? t.dayOfWeek.charAt(0).toUpperCase() + t.dayOfWeek.slice(1)
      : "—";
    return `Every ${day} at ${t.sendTime}`;
  }
  if (t.frequency === "monthly") return `Day ${t.dayOfMonth} of each month at ${t.sendTime}`;
  return "—";
};

// ─── Validation ───────────────────────────────────────────────────────────────

const makeValidationSchema = (recipientType: "group" | "custom") =>
  Yup.object().shape({
    name: Yup.string().required("Template name is required"),
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().required("Email body is required"),
    recipient: recipientType === "group"
      ? Yup.string().required("Select a recipient group")
      : Yup.string()
          .required("Recipient email is required")
          .test("emails", "Enter valid email(s)", (val) =>
            (val ?? "")
              .split(",")
              .map((e) => e.trim())
              .every((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
          ),
    frequency: Yup.string().required(),
    sendDate: Yup.string().required("Send date is required"),
    sendTime: Yup.string().required("Send time is required"),
    dayOfWeek: Yup.string().when("frequency", {
      is: "weekly",
      then: (s) => s.required("Day of week is required"),
    }),
    dayOfMonth: Yup.string().when("frequency", {
      is: "monthly",
      then: (s) => s.required("Day of month is required"),
    }),
    status: Yup.string().required(),
  });

const emptyTemplate = {
  name: "",
  subject: "",
  body: "",
  recipient: "",
  frequency: "one-time" as Frequency,
  sendDate: "",
  sendTime: "09:00",
  dayOfWeek: "monday",
  dayOfMonth: "1",
  status: "draft" as Status,
};

// ─── TemplateDialog ───────────────────────────────────────────────────────────

interface TemplateDialogProps {
  template?: EmailTemplate;
  onSaved: (t: EmailTemplate) => void;
  trigger: React.ReactNode;
  statusItems: { val: string; label: string }[];
  frequencyItems: { val: string; label: string }[];
  groups: EmailGroup[];
}

const isGroupName = (recipient: string, groups: EmailGroup[]) =>
  groups.some((g) => g.name === recipient);

const TemplateDialog = ({ template, onSaved, trigger, statusItems, frequencyItems, groups }: TemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialRecipientType = (template && isGroupName(template.recipient, groups))
    ? "group"
    : "custom" as "group" | "custom";

  const [recipientType, setRecipientType] = useState<"group" | "custom">(initialRecipientType);

  const { values, errors, touched, handleChange, handleSubmit, resetForm, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: template
        ? {
            name: template.name,
            subject: template.subject,
            body: template.body,
            recipient: template.recipient,
            frequency: template.frequency,
            sendDate: template.sendDate,
            sendTime: template.sendTime,
            dayOfWeek: template.dayOfWeek || "monday",
            dayOfMonth: template.dayOfMonth || "1",
            status: template.status,
          }
        : emptyTemplate,
      validationSchema: makeValidationSchema(recipientType),
      onSubmit: (vals) => {
        setIsLoading(true);

        if (template?._id) {
          // Update existing
          const controller = new AbortController();
          apiEmailTemplates.putById!(template._id, vals, controller.signal, "", true).then((res) => {
            if (res && res._id) {
              toast.success("Template updated");
              onSaved(res as EmailTemplate);
              setOpen(false);
              resetForm();
            } else {
              toast.error(res?.message ?? "Failed to update template");
            }
            setIsLoading(false);
          });
        } else {
          // Create new
          apiEmailTemplates.post!(vals, "", true).then((res) => {
            if (res && res._id) {
              toast.success("Template created");
              onSaved(res as EmailTemplate);
              setOpen(false);
              resetForm();
            } else {
              toast.error(res?.message ?? "Failed to create template");
            }
            setIsLoading(false);
          });
        }
      },
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "New Email Template"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Name + Status */}
          <div className="grid grid-cols-2 gap-4">
            <CustomTextField
              label="Template Name"
              name="name"
              placeholder="ex: Weekly Digest"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomSelectField
              label="Status"
              name="status"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              labelItms={statusItems}
            />
          </div>

          {/* Subject */}
          <CustomTextField
            label="Subject"
            name="subject"
            placeholder="ex: Your weekly summary"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />

          {/* Recipient */}
          <div className="space-y-2">
            <Label>Recipients</Label>
            {/* Type toggle */}
            <div className="flex rounded-md border overflow-hidden w-fit text-xs">
              <button
                type="button"
                onClick={() => { setRecipientType("group"); setFieldValue("recipient", ""); }}
                className={cn(
                  "px-3 py-1.5 font-medium transition-colors",
                  recipientType === "group"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                Email Group
              </button>
              <button
                type="button"
                onClick={() => { setRecipientType("custom"); setFieldValue("recipient", ""); }}
                className={cn(
                  "px-3 py-1.5 font-medium transition-colors",
                  recipientType === "custom"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                Custom Email
              </button>
            </div>

            {recipientType === "group" ? (
              <div className="space-y-1">
                <Select value={values.recipient} onValueChange={(v) => setFieldValue("recipient", v)}>
                  <SelectTrigger className={cn(touched.recipient && errors.recipient && "border-destructive")}>
                    <SelectValue placeholder="Select a group…" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((g) => (
                      <SelectItem key={g._id} value={g.name}>
                        <span className="font-medium">{g.name}</span>
                        {g.description && (
                          <span className="text-muted-foreground ml-1.5 text-xs">— {g.description}</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.recipient && errors.recipient && (
                  <p className="text-xs text-destructive">{errors.recipient}</p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <Input
                  name="recipient"
                  placeholder="user@company.com, another@company.com"
                  value={values.recipient}
                  onChange={handleChange}
                  className={cn(touched.recipient && errors.recipient && "border-destructive")}
                />
                {touched.recipient && errors.recipient && (
                  <p className="text-xs text-destructive">{errors.recipient}</p>
                )}
                <p className="text-xs text-muted-foreground">Separate multiple emails with a comma</p>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="space-y-1">
            <Label>Email Body</Label>
            <Editor
              key={template?._id ?? "new"}
              editorSerializedState={(() => {
                try { return values.body ? (JSON.parse(values.body) as SerializedEditorState) : undefined; }
                catch { return undefined; }
              })()}
              onSerializedChange={(s) => setFieldValue("body", JSON.stringify(s))}
            />
            {touched.body && errors.body && (
              <p className="text-xs text-destructive">{errors.body}</p>
            )}
            <p className="text-xs text-muted-foreground pl-0.5">
              Dynamic variables: {"{{name}}"}, {"{{email}}"}, {"{{date}}"}
            </p>
          </div>

          {/* Schedule block */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarClock className="h-4 w-4 text-primary" />
              Schedule
            </div>

            {/* Frequency + Time */}
            <div className="grid grid-cols-2 gap-4">
              <CustomSelectField
                label="Frequency"
                name="frequency"
                values={values}
                handleChange={handleChange}
                touched={touched}
                errors={errors}
                labelItms={frequencyItems}
              />
              <div className="space-y-1">
                <Label htmlFor="sendTime">Send Time</Label>
                <Input
                  id="sendTime"
                  name="sendTime"
                  type="time"
                  value={values.sendTime}
                  onChange={handleChange}
                  className={cn(touched.sendTime && errors.sendTime && "border-destructive")}
                />
                {touched.sendTime && errors.sendTime && (
                  <p className="text-xs text-destructive">{errors.sendTime}</p>
                )}
              </div>
            </div>

            {/* Date + conditional day picker */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="sendDate">
                  {values.frequency === "one-time" ? "Send Date" : "Start Date"}
                </Label>
                <Input
                  id="sendDate"
                  name="sendDate"
                  type="date"
                  value={values.sendDate}
                  onChange={handleChange}
                  className={cn(touched.sendDate && errors.sendDate && "border-destructive")}
                />
                {touched.sendDate && errors.sendDate && (
                  <p className="text-xs text-destructive">{errors.sendDate}</p>
                )}
              </div>

              {values.frequency === "weekly" && (
                <CustomSelectField
                  label="Day of Week"
                  name="dayOfWeek"
                  values={values}
                  handleChange={handleChange}
                  touched={touched}
                  errors={errors}
                  labelItms={[
                    { val: "monday", label: "Monday" },
                    { val: "tuesday", label: "Tuesday" },
                    { val: "wednesday", label: "Wednesday" },
                    { val: "thursday", label: "Thursday" },
                    { val: "friday", label: "Friday" },
                    { val: "saturday", label: "Saturday" },
                    { val: "sunday", label: "Sunday" },
                  ]}
                />
              )}

              {values.frequency === "monthly" && (
                <CustomSelectField
                  label="Day of Month"
                  name="dayOfMonth"
                  values={values}
                  handleChange={handleChange}
                  touched={touched}
                  errors={errors}
                  labelItms={Array.from({ length: 28 }, (_, i) => ({
                    val: String(i + 1),
                    label: String(i + 1),
                  }))}
                />
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {template ? "Save Changes" : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── GroupDialog ──────────────────────────────────────────────────────────────

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
      apiContacts.getByParams!({ limit: 500 }, new AbortController().signal, "", true).then((res) => {
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
    if (!name.trim()) { setNameError("Name is required"); return; }
    setSaving(true);
    const payload = { name: name.trim(), description: description.trim(), contactIds: [...selectedIds] };
    const res = group?._id
      ? await apiEmailGroups.putById!(group._id, payload, new AbortController().signal, "", true)
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
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{group ? "Edit Group" : "New Email Group"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="gname">Group Name</Label>
            <Input
              id="gname"
              placeholder="ex: Qualified Leads"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              className={cn(nameError && "border-destructive")}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="gdesc">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              id="gdesc"
              placeholder="What contacts does this group target?"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Contact picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Contacts</Label>
              <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
            </div>
            <Input
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
            />
            <div className="border rounded-md overflow-y-auto max-h-52">
              {loadingContacts ? (
                <p className="text-xs text-muted-foreground text-center py-6">Loading contacts…</p>
              ) : filtered.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No contacts found</p>
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
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>
              {group ? "Save Changes" : "Create Group"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const Emails = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { emailTemplateStatuses, emailTemplateFrequencies } = useEnums();

  const statusItems = toLabelItems(emailTemplateStatuses);
  const frequencyItems = toLabelItems(emailTemplateFrequencies);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      apiEmailTemplates.getAll!(controller.signal, true),
      apiEmailGroups.getAll!(controller.signal, true),
    ]).then(([tmplRes, groupRes]) => {
      if (Array.isArray(tmplRes)) setTemplates(tmplRes);
      if (Array.isArray(groupRes)) setGroups(groupRes);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

  const handleSaved = (updated: EmailTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t._id === updated._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
  };

  const handleDelete = (_id: string) => {
    apiEmailTemplates.remove!(_id, "", true).then((res) => {
      if (res && res.message === "Email template deleted") {
        setTemplates((prev) => prev.filter((t) => t._id !== _id));
        toast.success("Template deleted");
      } else {
        toast.error(res?.message ?? "Failed to delete template");
      }
    });
  };

  const handleGroupSaved = (updated: EmailGroup) => {
    setGroups((prev) => {
      const idx = prev.findIndex((g) => g._id === updated._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
  };

  const handleGroupDelete = (_id: string, name: string) => {
    confirmToast({
      title: `Delete "${name}"?`,
      description: "Templates using this group will lose their recipient.",
      onConfirm: async () => {
        const res = await apiEmailGroups.remove!(_id, "", true);
        if (res?.message === "Email group deleted" || res?._id || !res?.error) {
          setGroups((prev) => prev.filter((g) => g._id !== _id));
          toast.success("Group deleted");
        } else {
          toast.error(res?.message ?? "Failed to delete group");
        }
      },
    });
  };

  const columns = [
    {
      label: "Name",
      name: "name",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const t = templates[rowIndex];
          return (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-medium">{t?.name}</span>
            </div>
          );
        },
      },
    },
    { label: "Subject", name: "subject" },
    { label: "Recipient(s)", name: "recipient" },
    {
      label: "Frequency",
      name: "frequency",
      options: {
        customBodyRender: (val: Frequency) => (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {frequencyLabel[val]}
          </div>
        ),
      },
    },
    {
      label: "Schedule",
      name: "sendDate",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const t = templates[rowIndex];
          return (
            <span className="text-muted-foreground text-xs">
              {t ? scheduleLabel(t) : "—"}
            </span>
          );
        },
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        customBodyRender: (val: Status) => (
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              statusStyles[val],
            )}
          >
            {val}
          </span>
        ),
      },
    },
    {
      label: "Actions",
      name: "_id",
      options: {
        customBodyRender: (_: any, rowIndex: number) => {
          const t = templates[rowIndex];
          if (!t) return null;
          return (
            <div className="flex items-center gap-1">
              <TemplateDialog
                template={t}
                onSaved={handleSaved}
                statusItems={statusItems}
                frequencyItems={frequencyItems}
                groups={groups}
                trigger={
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => handleDelete(t._id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    },
  ];

  const [tab, setTab] = useState<"templates" | "groups">("templates");

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Emails</h1>
          <p className="text-sm text-muted-foreground">
            Manage templates and contact groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex rounded-lg border overflow-hidden text-sm">
            <button
              onClick={() => setTab("templates")}
              className={cn(
                "px-4 py-1.5 font-medium transition-colors",
                tab === "templates"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              <Mail className="h-3.5 w-3.5 inline mr-1.5 -mt-px" />
              Templates
            </button>
            <button
              onClick={() => setTab("groups")}
              className={cn(
                "px-4 py-1.5 font-medium transition-colors",
                tab === "groups"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              <Users className="h-3.5 w-3.5 inline mr-1.5 -mt-px" />
              Groups
            </button>
          </div>

          {/* Context action */}
          {tab === "templates" ? (
            <TemplateDialog
              onSaved={handleSaved}
              statusItems={statusItems}
              frequencyItems={frequencyItems}
              groups={groups}
              trigger={
                <Button>
                  <Plus className="h-4 w-4" /> New Template
                </Button>
              }
            />
          ) : (
            <GroupDialog
              onSaved={handleGroupSaved}
              trigger={
                <Button>
                  <Plus className="h-4 w-4" /> New Group
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* ── Templates tab ─────────────────────────────────────────────────── */}
      {tab === "templates" && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total" value={templates.length} />
            {emailTemplateStatuses.map((status) => (
              <StatCard
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                value={templates.filter((t) => t.status === status).length}
              />
            ))}
          </div>

          {isLoading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <CustomTable
              columns={columns}
              data={templates}
              title="Templates"
              downloadName="email-templates"
            />
          )}
        </>
      )}

      {/* ── Groups tab ────────────────────────────────────────────────────── */}
      {tab === "groups" && (
        <>
          {isLoading ? (
            <TableSkeleton rows={3} cols={4} />
          ) : groups.length === 0 ? (
            <div className="rounded-lg border bg-card p-10 flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="font-medium">No groups yet</p>
              <p className="text-sm text-muted-foreground">
                Create a group to target specific contacts in your templates.
              </p>
              <GroupDialog
                onSaved={handleGroupSaved}
                trigger={
                  <Button size="sm">
                    <Plus className="h-4 w-4" /> Create First Group
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contacts</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => (
                    <tr key={g._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{g.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{g.description || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                          <Users className="h-3 w-3" />
                          {g.contactIds.length}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <GroupDialog
                            group={g}
                            onSaved={handleGroupSaved}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleGroupDelete(g._id, g.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Emails;
