import * as Yup from "yup";

export type Frequency = "one-time" | "daily" | "weekly" | "monthly";
export type Status = "active" | "draft" | "paused";

export interface EmailGroup {
  _id: string;
  name: string;
  description: string;
  contactIds: string[];
}

export interface EmailTemplate {
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

export const frequencyLabel: Record<Frequency, string> = {
  "one-time": "One-time",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export const statusStyles: Record<Status, string> = {
  active: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

export const scheduleLabel = (t: EmailTemplate) => {
  if (t.frequency === "one-time") return `${t.sendDate} at ${t.sendTime}`;
  if (t.frequency === "daily") return `Daily at ${t.sendTime}`;
  if (t.frequency === "weekly") {
    const day = t.dayOfWeek
      ? t.dayOfWeek.charAt(0).toUpperCase() + t.dayOfWeek.slice(1)
      : "—";
    return `Every ${day} at ${t.sendTime}`;
  }
  if (t.frequency === "monthly")
    return `Day ${t.dayOfMonth} of each month at ${t.sendTime}`;
  return "—";
};

export const emptyTemplate = {
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

export const isGroupName = (recipient: string, groups: EmailGroup[]) =>
  groups.some((g) => g.name === recipient);

export const makeValidationSchema = (recipientType: "group" | "custom") =>
  Yup.object().shape({
    name: Yup.string().required("Template name is required"),
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().required("Email body is required"),
    recipient:
      recipientType === "group"
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
