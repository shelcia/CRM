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
