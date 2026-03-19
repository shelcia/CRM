import { ArrowDown, ArrowRight, ArrowUp, ChevronsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toLabel } from "@/utils/enumLabel";

const CONFIG: Record<string, { icon: React.ReactNode; className: string }> = {
  low: {
    icon: <ArrowDown className="h-3.5 w-3.5" />,
    className: "text-muted-foreground",
  },
  medium: {
    icon: <ArrowRight className="h-3.5 w-3.5" />,
    className: "text-blue-500",
  },
  high: {
    icon: <ArrowUp className="h-3.5 w-3.5" />,
    className: "text-orange-500",
  },
  veryHigh: {
    icon: <ChevronsUp className="h-3.5 w-3.5" />,
    className: "text-red-500",
  },
  critical: {
    icon: <ChevronsUp className="h-3.5 w-3.5" />,
    className: "text-red-500",
  },
};

interface PriorityIndicatorProps {
  value: string;
  showLabel?: boolean;
  className?: string;
}

export const PriorityIndicator = ({
  value,
  showLabel = true,
  className,
}: PriorityIndicatorProps) => {
  const cfg = CONFIG[value] ?? CONFIG.medium;

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", cfg.className, className)}>
      {cfg.icon}
      {showLabel && <span>{toLabel(value)}</span>}
    </span>
  );
};
