import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Check, X, GripVertical } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { CustomTextAreaField, CustomTextField } from "@/components/CustomInputs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { apiProvider } from "@/services/utilities/provider";

// ── Types ─────────────────────────────────────────────────────────────────────

type TodoAuthor = { name: string; image: string };

type Todo = {
  _id: string;
  columnId: string;
  projectId: string;
  title: string;
  description: string;
  author: TodoAuthor;
  statusColor?: string;
  date: string;
};

type Column = {
  _id: string;
  name: string;
  order: number;
  todos: Todo[];
};

// ── Drag-and-drop helper ───────────────────────────────────────────────────────

const reorder = <T,>(list: T[], from: number, to: number): T[] => {
  const result = [...list];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
};

// ── Main board component ───────────────────────────────────────────────────────

const Projects = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [addingColId, setAddingColId] = useState<string | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    const controller = new AbortController();
    apiProvider
      .getAll(`projects/${projectId}/board`, controller.signal, true)
      .then((res) => {
        if (Array.isArray(res)) setColumns(res);
      });
    return () => controller.abort();
  }, [projectId]);

  // ── Drag end ──────────────────────────────────────────────────────────────

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const srcColIdx = columns.findIndex((c) => c._id === source.droppableId);
    const dstColIdx = columns.findIndex((c) => c._id === destination.droppableId);
    const srcCol = columns[srcColIdx];
    const dstCol = columns[dstColIdx];

    let updatedColumns: Column[];
    let movedTodo: Todo;

    if (source.droppableId === destination.droppableId) {
      const newTodos = reorder(srcCol.todos, source.index, destination.index);
      updatedColumns = columns.map((c) =>
        c._id === srcCol._id ? { ...c, todos: newTodos } : c,
      );
      movedTodo = newTodos[destination.index];
    } else {
      const srcTodos = [...srcCol.todos];
      const dstTodos = [...dstCol.todos];
      [movedTodo] = srcTodos.splice(source.index, 1);
      movedTodo = { ...movedTodo, columnId: dstCol._id };
      dstTodos.splice(destination.index, 0, movedTodo);
      updatedColumns = columns.map((c) => {
        if (c._id === srcCol._id) return { ...c, todos: srcTodos };
        if (c._id === dstCol._id) return { ...c, todos: dstTodos };
        return c;
      });

      apiProvider.put("todos", { columnId: dstCol._id }, movedTodo._id, true);
    }

    setColumns(updatedColumns);
  };

  // ── Column CRUD ───────────────────────────────────────────────────────────

  const handleAddColumn = (name: string) => {
    apiProvider
      .post("projects", { name }, `${projectId}/columns`, true)
      .then((res) => {
        if (res?._id) {
          setColumns((prev) => [...prev, { ...res, todos: [] }]);
          setShowAddColumn(false);
        }
      });
  };

  const handleRenameColumn = (colId: string, name: string) => {
    apiProvider
      .put("projects", { name }, `${projectId}/columns/${colId}`, true)
      .then(() => {
        setColumns((prev) =>
          prev.map((c) => (c._id === colId ? { ...c, name } : c)),
        );
      });
  };

  const handleDeleteColumn = (colId: string) => {
    apiProvider
      .remove("projects", colId, `${projectId}/columns`, true)
      .then(() => {
        setColumns((prev) => prev.filter((c) => c._id !== colId));
      });
  };

  // ── Todo CRUD ─────────────────────────────────────────────────────────────

  const handleAddTodo = (
    colId: string,
    todo: Omit<Todo, "_id" | "date" | "projectId" | "columnId">,
  ) => {
    apiProvider
      .post("projects", { ...todo, columnId: colId }, `${projectId}/todos`, true)
      .then((res) => {
        if (res?._id) {
          setColumns((prev) =>
            prev.map((c) =>
              c._id === colId ? { ...c, todos: [...c.todos, res] } : c,
            ),
          );
          setAddingColId(null);
        }
      });
  };

  const handleDeleteTodo = (colId: string, todoId: string) => {
    apiProvider.remove("todos", todoId, "", true).then(() => {
      setColumns((prev) =>
        prev.map((c) =>
          c._id === colId
            ? { ...c, todos: c.todos.filter((t) => t._id !== todoId) }
            : c,
        ),
      );
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 items-start">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => (
          <div key={col._id} className="flex-shrink-0 w-68">
            <div className="rounded-xl bg-muted/50 border flex flex-col max-h-[calc(100vh-10rem)]">
              <ColumnHeader
                column={col}
                onRename={(name) => handleRenameColumn(col._id, name)}
                onDelete={() => handleDeleteColumn(col._id)}
                onAddTodo={() =>
                  setAddingColId((prev) => (prev === col._id ? null : col._id))
                }
              />

              <Droppable droppableId={col._id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 overflow-y-auto p-2 space-y-2 min-h-[4rem] transition-colors",
                      snapshot.isDraggingOver && "bg-primary/5",
                    )}
                  >
                    {addingColId === col._id && (
                      <AddTodoForm
                        onSubmit={(todo) => handleAddTodo(col._id, todo)}
                        onCancel={() => setAddingColId(null)}
                      />
                    )}
                    {col.todos.map((todo, idx) => (
                      <Draggable draggableId={todo._id} index={idx} key={todo._id}>
                        {(provided, snapshot) => (
                          <TodoCard
                            todo={todo}
                            provided={provided}
                            isDragging={snapshot.isDragging}
                            onDelete={() => handleDeleteTodo(col._id, todo._id)}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {col.todos.length === 0 && addingColId !== col._id && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No cards yet
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>

      {/* Add column */}
      <div className="flex-shrink-0 w-68">
        {showAddColumn ? (
          <div className="rounded-xl bg-muted/50 border p-3">
            <AddColumnForm
              onSubmit={handleAddColumn}
              onCancel={() => setShowAddColumn(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowAddColumn(true)}
            className="w-full flex items-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add column
          </button>
        )}
      </div>
    </div>
  );
};

export default Projects;

// ── Column header ──────────────────────────────────────────────────────────────

const ColumnHeader = ({
  column,
  onRename,
  onDelete,
  onAddTodo,
}: {
  column: Column;
  onRename: (name: string) => void;
  onDelete: () => void;
  onAddTodo: () => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.name);

  const save = () => {
    if (draft.trim() && draft !== column.name) onRename(draft.trim());
    setEditing(false);
  };

  return (
    <div className="px-3 py-2.5 flex items-center gap-2">
      {editing ? (
        <>
          <input
            autoFocus
            className="flex-1 text-sm font-semibold bg-transparent border-b border-primary outline-none"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <button onClick={save} className="text-primary">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setEditing(false)} className="text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      ) : (
        <>
          <h5 className="flex-1 font-semibold text-sm truncate">{column.name}</h5>
          <span className="text-xs text-muted-foreground tabular-nums bg-muted rounded-full px-1.5 py-0.5">
            {column.todos.length}
          </span>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={onAddTodo}
            title="Add card"
          >
            <Plus className="h-4 w-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
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

// ── Todo card ──────────────────────────────────────────────────────────────────

const TodoCard = ({
  todo,
  provided,
  isDragging,
  onDelete,
}: {
  todo: Todo;
  provided: any;
  isDragging: boolean;
  onDelete: () => void;
}) => (
  <Card
    ref={provided.innerRef}
    {...provided.draggableProps}
    style={{ ...provided.draggableProps.style }}
    className={cn(
      "p-3 group transition-shadow",
      isDragging && "shadow-lg ring-1 ring-primary/20",
    )}
  >
    {/* Drag handle + actions row */}
    <div className="flex items-start justify-between gap-2 mb-2">
      <div
        {...provided.dragHandleProps}
        className="mt-0.5 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        {todo.statusColor && (
          <span
            className="inline-block h-2 w-2 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: todo.statusColor }}
          />
        )}
        <p className="text-sm font-medium leading-snug">{todo.title}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all flex-shrink-0">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* Description */}
    {todo.description && (
      <p className="text-xs text-muted-foreground line-clamp-2 ml-5 mb-2">
        {todo.description}
      </p>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between ml-5">
      <div className="flex items-center gap-1.5">
        <img
          src={todo.author.image}
          alt={todo.author.name}
          className="h-5 w-5 rounded-full object-cover bg-muted"
        />
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
  </Card>
);

// ── Add todo form ──────────────────────────────────────────────────────────────

const AddTodoForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (todo: Omit<Todo, "_id" | "date" | "projectId" | "columnId">) => void;
  onCancel: () => void;
}) => {
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: {
      title: "",
      description: "",
      statusColor: "#4ade80",
      author: { name: "", image: "/static/avatar/001-man.svg" },
    },
    validationSchema: Yup.object({
      title: Yup.string().min(3, "Too short").required("Required"),
    }),
    onSubmit: (v) =>
      onSubmit({
        title: v.title,
        description: v.description,
        statusColor: v.statusColor,
        author: v.author,
      }),
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-card p-3 space-y-2 shadow-sm"
    >
      <CustomTextField
        name="title"
        placeholder="Card title"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <CustomTextAreaField
        name="description"
        placeholder="Description (optional)"
        rows={2}
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground">Color</label>
        <input
          type="color"
          name="statusColor"
          value={values.statusColor}
          onChange={handleChange}
          className="h-6 w-6 rounded cursor-pointer border-0 bg-transparent p-0"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Add card
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ── Add column form ────────────────────────────────────────────────────────────

const AddColumnForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) => {
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Required"),
    }),
    onSubmit: (v) => onSubmit(v.name),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <CustomTextField
        name="name"
        placeholder="Column name"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Add
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
