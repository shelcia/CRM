import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  dragHandleProps: any;
  className?: string;
}

const DragHandle = ({ dragHandleProps, className }: DragHandleProps) => (
  <div
    {...dragHandleProps}
    className={cn(
      "text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors shrink-0",
      className,
    )}
  >
    <GripVertical className="h-4 w-4" />
  </div>
);

export default DragHandle;
