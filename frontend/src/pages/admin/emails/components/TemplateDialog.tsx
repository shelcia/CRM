import { useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { SerializedEditorState } from "lexical";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/custom";
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
  DatePicker,
  TimePicker,
} from "@/components/custom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/blocks/editor-00/editor";
import { apiEmailTemplates } from "@/services/models/emailTemplatesModel";
import { EmailGroup, EmailTemplate } from "../types";
import { emptyTemplate, isGroupName, makeValidationSchema } from "../helpers";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toLabel } from "@/utils";

interface TemplateDialogProps {
  template?: EmailTemplate;
  onSaved: (t: EmailTemplate) => void;
  trigger: React.ReactNode;
  statusItems: { val: string; label: string }[];
  frequencyItems: { val: string; label: string }[];
  groups: EmailGroup[];
}

const TemplateDialog = ({
  template,
  onSaved,
  trigger,
  statusItems,
  frequencyItems,
  groups,
}: TemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialRecipientType =
    template && isGroupName(template.recipient, groups)
      ? "email-group"
      : ("custom-emails" as "email-group" | "custom-emails");

  const [recipientType, setRecipientType] = useState<
    "email-group" | "custom-emails"
  >(initialRecipientType);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
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
        const controller = new AbortController();
        apiEmailTemplates.putById!(
          template._id,
          vals,
          controller.signal,
          "",
          true,
        ).then((res) => {
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
    <CustomModal
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
      title={template ? "Edit Template" : "New Email Template"}
      trigger={trigger}
      size="xl"
      contentClassName="max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-1">
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
        <div className="space-y-4">
          <Label>Recipients</Label>
          <RadioGroup
            defaultValue={recipientType}
            className="w-fit flex gap-4"
            onValueChange={(v) =>
              setRecipientType(v as "email-group" | "custom-emails")
            }
          >
            {["email-group", "custom-emails"].map((type) => (
              <div className="flex items-center gap-3" key={type}>
                <RadioGroupItem value={type} id={`r${Math.random()}`} />
                <Label htmlFor={type}>{toLabel(type)}</Label>
              </div>
            ))}
          </RadioGroup>
          {recipientType === "email-group" ? (
            <div className="space-y-1">
              <Select
                value={values.recipient}
                onValueChange={(v) => setFieldValue("recipient", v)}
              >
                <SelectTrigger
                  className={cn(
                    touched.recipient &&
                      errors.recipient &&
                      "border-destructive",
                  )}
                >
                  <SelectValue placeholder="Select a group…" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g._id} value={g.name}>
                      <span className="font-medium">{g.name}</span>
                      {g.description && (
                        <span className="text-muted-foreground ml-1.5 text-xs">
                          — {g.description}
                        </span>
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
                className={cn(
                  touched.recipient && errors.recipient && "border-destructive",
                )}
              />
              {touched.recipient && errors.recipient && (
                <p className="text-xs text-destructive">{errors.recipient}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with a comma
              </p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="space-y-1">
          <Label>Email Body</Label>
          <Editor
            key={template?._id ?? "new"}
            editorSerializedState={(() => {
              try {
                return values.body
                  ? (JSON.parse(values.body) as SerializedEditorState)
                  : undefined;
              } catch {
                return undefined;
              }
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

        {/* Schedule */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="h-4 w-4 text-primary" /> Schedule
          </div>
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
              <Label>Send Time</Label>
              <TimePicker
                value={values.sendTime}
                onChange={(v) => setFieldValue("sendTime", v)}
                error={!!(touched.sendTime && errors.sendTime)}
              />
              {touched.sendTime && errors.sendTime && (
                <p className="text-xs text-destructive">{errors.sendTime}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>
                {values.frequency === "one-time" ? "Send Date" : "Start Date"}
              </Label>
              <DatePicker
                value={values.sendDate}
                onChange={(v) => setFieldValue("sendDate", v)}
                error={!!(touched.sendDate && errors.sendDate)}
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
    </CustomModal>
  );
};

export default TemplateDialog;
