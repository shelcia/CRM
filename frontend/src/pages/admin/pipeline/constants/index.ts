export const STAGES: {
  key: string;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    key: "lead",
    label: "Lead",
    color: "bg-slate-100 dark:bg-slate-800",
    dot: "bg-slate-400",
  },
  {
    key: "qualified",
    label: "Qualified",
    color: "bg-blue-50 dark:bg-blue-950",
    dot: "bg-blue-500",
  },
  {
    key: "proposal",
    label: "Proposal",
    color: "bg-amber-50 dark:bg-amber-950",
    dot: "bg-amber-500",
  },
  {
    key: "negotiation",
    label: "Negotiation",
    color: "bg-orange-50 dark:bg-orange-950",
    dot: "bg-orange-500",
  },
  { key: "won", label: "Won", color: "bg-primary/5", dot: "bg-primary" },
  {
    key: "lost",
    label: "Lost",
    color: "bg-red-50 dark:bg-red-950",
    dot: "bg-red-500",
  },
];
