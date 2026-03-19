import { cn } from "@/lib/utils";
import { toLabel } from "@/utils/enumLabel";

const COLORS: Record<string, string> = {
  // Contact statuses
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  qualified: "bg-primary/10 text-primary border-primary/20",
  openDeal: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  connected: "bg-green-500/10 text-green-600 border-green-500/20",
  attempted: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  won: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",

  // Ticket statuses
  open: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  inProgress: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  closed: "bg-muted text-muted-foreground border-border",

  // Ticket statuses
  onHold: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  resolved: "bg-green-500/10 text-green-600 border-green-500/20",

  // Priorities
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  critical: "bg-red-500/10 text-red-600 border-red-500/20",

  // Ticket categories
  bug: "bg-red-500/10 text-red-600 border-red-500/20",
  feature: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  question: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  support: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  other: "bg-muted text-muted-foreground border-border",

  // Roles
  admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "non-admin": "bg-muted text-muted-foreground border-border",
};

const DEFAULT = "bg-muted text-muted-foreground border-border";

interface StatusBadgeProps {
  value: string;
  className?: string;
}

export const StatusBadge = ({ value, className }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap",
      COLORS[value] ?? DEFAULT,
      className,
    )}
  >
    {toLabel(value)}
  </span>
);
