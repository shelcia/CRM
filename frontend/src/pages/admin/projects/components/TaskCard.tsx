import { useState } from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import { DragHandle } from "@/components/custom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Todo, TodoAuthor } from "../types";
import { AssignedToSelect, AuthorAvatar } from "@/components/common";
import { Textarea } from "@/components/ui/textarea";

interface TaskCardProps {
  todo: Todo;
  provided: any;
  isDragging: boolean;
  onDelete: () => void;
  onEdit: (updates: {
    title: string;
    description: string;
    author: TodoAuthor;
  }) => void;
}

const TaskCard = ({
  todo,
  provided,
  isDragging,
  onDelete,
  onEdit,
}: TaskCardProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [assignee, setAssignee] = useState(todo.author.name);

  const save = () => {
    if (!title.trim()) return;
    onEdit({
      title: title.trim(),
      description: description.trim(),
      author: { name: assignee, image: todo.author.image },
    });
    setEditing(false);
  };

  const cancel = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setAssignee(todo.author.name);
    setEditing(false);
  };

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{ ...provided.draggableProps.style }}
      className={cn(
        "p-3 group transition-shadow",
        isDragging && "shadow-lg ring-1 ring-primary/20",
      )}
    >
      {editing ? (
        <div className="space-y-2">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
            className="h-7 text-sm"
            placeholder="Card title"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Description (optional)"
            className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <AssignedToSelect
            value={assignee}
            onChange={setAssignee}
            triggerClassName="h-7 text-xs"
          />
          <div className="flex gap-1.5">
            <Button size="sm" className="flex-1 h-7 text-xs" onClick={save}>
              <Check className="h-3 w-3 mr-1" /> Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={cancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2 mb-2">
            <DragHandle
              dragHandleProps={provided.dragHandleProps}
              className="mt-0.5"
            />
            <p className="text-sm font-medium leading-snug flex-1">
              {todo.title}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all flex-shrink-0">
                  <Pencil className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditing(true)}>
                  <Pencil className="size-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="size-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {todo.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 ml-5 mb-2">
              {todo.description}
            </p>
          )}

          <div className="flex items-center justify-between ml-5">
            <div className="flex items-center gap-1.5">
              <AuthorAvatar name={todo.author.name} image={todo.author.image} />
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                {todo.author.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(todo.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </>
      )}
    </Card>
  );
};

export default TaskCard;
