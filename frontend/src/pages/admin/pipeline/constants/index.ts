export const STAGES: {
  key: string;
  label: string;
  color: string;
}[] = [
  {
    key: "lead",
    label: "Lead",
    color: "bg-slate-100 dark:bg-slate-800",
  },
  {
    key: "qualified",
    label: "Qualified",
    color: "bg-blue-50 dark:bg-blue-950",
  },
  {
    key: "proposal",
    label: "Proposal",
    color: "bg-amber-50 dark:bg-amber-950",
  },
  {
    key: "negotiation",
    label: "Negotiation",
    color: "bg-orange-50 dark:bg-orange-950",
  },
  { key: "won", label: "Won", color: "bg-primary/5" },
  {
    key: "lost",
    label: "Lost",
    color: "bg-red-50 dark:bg-red-950",
  },
];
