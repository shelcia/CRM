import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteIconButtonProps {
  onClick: () => void;
  size?: "icon" | "icon-sm";
  className?: string;
}

export const DeleteIconButton = ({
  onClick,
  size = "icon",
  className,
}: DeleteIconButtonProps) => (
  <Button
    variant="ghost"
    size={size}
    className={cn(
      "text-destructive hover:text-destructive hover:bg-destructive/10",
      className,
    )}
    onClick={onClick}
  >
    <Trash2 className="size-4" />
  </Button>
);
