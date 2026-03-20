import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  size?: "icon" | "icon-sm" | "default";
  className?: string;
  text?: string;
}

export const EditIconButton = ({
  onClick,
  size = "icon",
  className,
}: CustomButtonProps) => (
  <Button
    variant="ghost"
    size={size}
    className={cn("text-muted-foreground hover:text-foreground", className)}
    onClick={onClick}
  >
    <Pencil className="size-4" />
  </Button>
);

export const DeleteIconButton = ({
  onClick,
  size = "icon",
  className,
}: CustomButtonProps) => (
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

export const AddPrimaryButton = ({
  onClick,
  size = "default",
  className,
  text = "Add",
}: CustomButtonProps) => (
  <Button onClick={onClick} className={className} size={size}>
    <Plus className="size-4" strokeWidth={2.5} /> {text}
  </Button>
);
