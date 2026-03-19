import { Status, Frequency } from "../types";

export const frequencyLabel: Record<Frequency, string> = {
  "one-time": "One-time",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export const statusStyles: Record<Status, string> = {
  active: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
  paused:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};
