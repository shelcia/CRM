import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export const CustomEmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) => {
  if (compact) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-2 py-10 text-muted-foreground",
          className,
        )}
      >
        <Icon className="h-8 w-8 opacity-30" />
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-xs text-center max-w-xs">{description}</p>
        )}
        {action}
      </div>
    );
  }

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-8 text-muted-foreground/50" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-1">
        {action && action}
      </EmptyContent>
    </Empty>
  );
};
