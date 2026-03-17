import React, { useEffect, useState } from "react";
import { Plus, Mail, Clock, Pencil, Trash2, CalendarClock } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import CustomTable from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CustomTextField,
  CustomTextAreaField,
  CustomSelectField,
} from "@/components/CustomInputs";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { apiEmailTemplates } from "@/services/models/emailTemplatesModel";
import { useEnums } from "@/hooks/useEnums";
import { toLabelItems } from "@/utils/enumLabel";

// ─── Types ────────────────────────────────────────────────────────────────────

type Frequency = "one-time" | "daily" | "weekly" | "monthly";
type Status = "active" | "draft" | "paused";

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

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Template name is required"),
  subject: Yup.string().required("Subject is required"),
  body: Yup.string().required("Email body is required"),
  recipient: Yup.string()
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
}

const TemplateDialog = ({ template, onSaved, trigger, statusItems, frequencyItems }: TemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
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
      validationSchema,
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
      <DialogContent className="max-w-2xl">
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
          <div className="space-y-1">
            <CustomTextField
              label="Recipient Email(s)"
              name="recipient"
              placeholder="user@company.com, another@company.com"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <p className="text-xs text-muted-foreground pl-0.5">
              Separate multiple emails with a comma
            </p>
          </div>

          {/* Body */}
          <div className="space-y-1">
            <Label>Email Body</Label>
            <CustomTextAreaField
              name="body"
              placeholder={`Write your email content here.\nSupported variables: {{name}}, {{email}}, {{date}}`}
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              rows={5}
            />
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
                <input
                  id="sendTime"
                  name="sendTime"
                  type="time"
                  value={values.sendTime}
                  onChange={handleChange}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    touched.sendTime && errors.sendTime && "border-destructive",
                  )}
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
                <input
                  id="sendDate"
                  name="sendDate"
                  type="date"
                  value={values.sendDate}
                  onChange={handleChange}
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    touched.sendDate && errors.sendDate && "border-destructive",
                  )}
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

// ─── Main Page ─────────────────────────────────────────────────────────────────

const Emails = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const { emailTemplateStatuses, emailTemplateFrequencies } = useEnums();

  const statusItems = toLabelItems(emailTemplateStatuses);
  const frequencyItems = toLabelItems(emailTemplateFrequencies);

  useEffect(() => {
    const controller = new AbortController();
    apiEmailTemplates.getAll!(controller.signal, true).then((res) => {
      if (Array.isArray(res)) setTemplates(res);
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

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <p className="text-sm text-muted-foreground">
            Create and schedule recurring or one-time emails
          </p>
        </div>
        <TemplateDialog
          onSaved={handleSaved}
          statusItems={statusItems}
          frequencyItems={frequencyItems}
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          }
        />
      </div>

      {/* Summary cards — driven from backend enums */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 pt-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold mt-1">{templates.length}</p>
          </CardContent>
        </Card>
        {emailTemplateStatuses.map((status) => (
          <Card key={status}>
            <CardContent className="p-4 pt-4">
              <p className="text-xs text-muted-foreground capitalize">{status}</p>
              <p className="text-2xl font-bold mt-1">
                {templates.filter((t) => t.status === status).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <CustomTable
        columns={columns}
        data={templates}
        title="Templates"
        downloadName="email-templates"
      />
    </section>
  );
};

export default Emails;
