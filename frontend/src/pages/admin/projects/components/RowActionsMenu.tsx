import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RowActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  triggerClassName?: string;
}

export const RowActionsMenu = ({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  triggerClassName,
}: RowActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          "text-muted-foreground hover:text-foreground",
          triggerClassName,
        )}
      >
        <Pencil className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={onEdit}>
        <Pencil className="size-4 mr-2" /> {editLabel}
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="size-4 mr-2" /> {deleteLabel}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
