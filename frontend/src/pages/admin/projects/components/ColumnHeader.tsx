import { useState } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import { DragHandle } from "@/components/custom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column } from "../types";

interface ColumnHeaderProps {
  column: Column;
  dragHandleProps: any;
  onRename: (name: string) => void;
  onDelete: () => void;
  onAddTodo: () => void;
}

const ColumnHeader = ({
  column,
  dragHandleProps,
  onRename,
  onDelete,
  onAddTodo,
}: ColumnHeaderProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.name);

  const save = () => {
    if (draft.trim() && draft !== column.name) onRename(draft.trim());
    setEditing(false);
  };

  return (
    <div className="px-3 py-2.5 flex items-center gap-2">
      <DragHandle dragHandleProps={dragHandleProps} />

      {editing ? (
        <>
          <Input
            autoFocus
            className="flex-1 h-7 text-sm font-semibold bg-transparent border-0 border-b border-primary rounded-none shadow-none focus-visible:ring-0 px-0"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={save}
            className="text-primary hover:text-primary"
          >
            <Check className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setEditing(false)}
          >
            <X className="size-4" />
          </Button>
        </>
      ) : (
        <>
          <h5 className="flex-1 font-semibold text-sm truncate">
            {column.name}
          </h5>
          <span className="text-xs text-muted-foreground tabular-nums bg-muted rounded-full px-1.5 py-0.5">
            {column.todos.length}
          </span>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onAddTodo}
            title="Add card"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <Pencil className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(true)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                Delete column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default ColumnHeader;
