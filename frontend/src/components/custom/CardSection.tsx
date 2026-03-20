import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const CardSection = ({
  icon,
  title,
  children,
  className,
  contentClassName,
}: CardSectionProps) => (
  <Card className={className}>
    <div className="flex items-center gap-3 px-6 py-4 border-b">
      {icon}
      <span className="font-semibold text-sm">{title}</span>
    </div>
    <CardContent className={cn("pt-6", contentClassName)}>
      {children}
    </CardContent>
  </Card>
);
