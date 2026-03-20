import { cn } from "@/lib/utils";
import { toLabel } from "@/utils";
import CustomBadge, { badgeVariants } from "../custom/CustomBadge";
import { type VariantProps } from "class-variance-authority";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const VALUE_TO_VARIANT: Record<string, BadgeVariant> = {
  // Contact statuses
  new: "blue",
  qualified: "primary",
  openDeal: "warning",
  connected: "success",
  attempted: "orange",
  won: "emerald",

  // Ticket statuses
  open: "blue",
  inProgress: "warning",
  closed: "neutral",
  onHold: "neutral",
  resolved: "success",

  // Priorities
  low: "neutral",
  medium: "blue",
  high: "orange",
  critical: "danger",

  // Ticket categories
  bug: "danger",
  feature: "violet",
  question: "sky",
  support: "teal",
  other: "neutral",

  // Roles
  admin: "purple",
  manager: "blue",
  "non-admin": "neutral",

  active: "primary",
  draft: "neutral",
  paused: "warning",
};

interface StatusBadgeProps {
  value: string;
  className?: string;
}

export const StatusBadge = ({ value, className }: StatusBadgeProps) => (
  <CustomBadge
    variant={VALUE_TO_VARIANT[value] ?? "neutral"}
    className={cn(className)}
  >
    {toLabel(value)}
  </CustomBadge>
);
