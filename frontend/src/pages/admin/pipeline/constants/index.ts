export const STAGES: {
  key: string;
  label: string;
  color: string;
}[] = [
  {
    key: "lead",
    label: "Lead",
    color: "bg-primary/[0.04] border-primary/10",
  },
  {
    key: "qualified",
    label: "Qualified",
    color: "bg-primary/[0.07] border-primary/15",
  },
  {
    key: "proposal",
    label: "Proposal",
    color: "bg-primary/[0.10] border-primary/20",
  },
  {
    key: "negotiation",
    label: "Negotiation",
    color: "bg-primary/[0.13] border-primary/25",
  },
  {
    key: "won",
    label: "Won",
    color: "bg-primary/[0.18] border-primary/30",
  },
  {
    key: "lost",
    label: "Lost",
    color: "bg-destructive/5 border-destructive/20 dark:bg-destructive/10",
  },
];
