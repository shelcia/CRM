import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        success: "bg-green-500/10 text-green-600 border-green-500/20",
        warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        danger:  "bg-red-500/10 text-red-600 border-red-500/20",
        neutral: "bg-muted text-muted-foreground border-border",
        purple:  "bg-purple-500/10 text-purple-600 border-purple-500/20",
        blue:    "bg-blue-500/10 text-blue-600 border-blue-500/20",
        orange:  "bg-orange-500/10 text-orange-600 border-orange-500/20",
        teal:    "bg-teal-500/10 text-teal-600 border-teal-500/20",
        violet:  "bg-violet-500/10 text-violet-600 border-violet-500/20",
        sky:     "bg-sky-500/10 text-sky-600 border-sky-500/20",
        emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        primary: "bg-primary/10 text-primary border-primary/20",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

interface CustomBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

const CustomBadge = ({ variant, children, className }: CustomBadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)}>{children}</span>
);

export { badgeVariants };
export default CustomBadge;
