import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { DragHandle } from "@/components/custom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RowActionsMenu } from "./RowActionsMenu";
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
          <span className="text-xs font-medium tabular-nums bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
            {column.todos.length}
          </span>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onAddTodo}
            title="Add card"
            className="text-primary/60 hover:text-primary hover:bg-primary/10"
          >
            <Plus className="size-4" />
          </Button>
          <RowActionsMenu
            onEdit={() => setEditing(true)}
            onDelete={onDelete}
            editLabel="Rename"
            deleteLabel="Delete column"
          />
        </>
      )}
    </div>
  );
};

export default ColumnHeader;
