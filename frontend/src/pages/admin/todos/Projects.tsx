import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  CustomTextAreaField,
  CustomTextField,
} from "@/components/CustomInputs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  const [addingColId, setAddingColId] = useState<string | null>(null); // columnId where add-todo form is open
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Fetch board (columns + todos)
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
    const dstColIdx = columns.findIndex(
      (c) => c._id === destination.droppableId,
    );
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

      // Persist column move
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

  const handleAddTodo = (colId: string, todo: Omit<Todo, "_id" | "date" | "projectId" | "columnId">) => {
    apiProvider
      .post(
        "projects",
        { ...todo, columnId: colId },
        `${projectId}/todos`,
        true,
      )
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
    <div className="flex gap-4 overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => (
          <div key={col._id} className="flex-shrink-0 w-72">
            <Card className="h-full max-h-[75vh] flex flex-col">
              <ColumnHeader
                column={col}
                onRename={(name) => handleRenameColumn(col._id, name)}
                onDelete={() => handleDeleteColumn(col._id)}
                onAddTodo={() =>
                  setAddingColId((prev) =>
                    prev === col._id ? null : col._id,
                  )
                }
              />

              <Droppable droppableId={col._id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-auto p-3 space-y-3"
                  >
                    {addingColId === col._id && (
                      <AddTodoForm
                        onSubmit={(todo) => handleAddTodo(col._id, todo)}
                        onCancel={() => setAddingColId(null)}
                      />
                    )}
                    {col.todos.map((todo, idx) => (
                      <Draggable
                        draggableId={todo._id}
                        index={idx}
                        key={todo._id}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            provided={provided}
                            onDelete={() =>
                              handleDeleteTodo(col._id, todo._id)
                            }
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>
        ))}
      </DragDropContext>

      {/* Add column */}
      <div className="flex-shrink-0 w-72">
        {showAddColumn ? (
          <Card className="p-3">
            <AddColumnForm
              onSubmit={handleAddColumn}
              onCancel={() => setShowAddColumn(false)}
            />
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => setShowAddColumn(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Column
          </Button>
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
    <div className="p-3 border-b flex items-center gap-1">
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
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={onAddTodo}
            title="Add todo"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setEditing(true)}
            title="Rename column"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            className="text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            title="Delete column"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  );
};

// ── Todo card ──────────────────────────────────────────────────────────────────

const TodoCard = ({
  todo,
  provided,
  onDelete,
}: {
  todo: Todo;
  provided: any;
  onDelete: () => void;
}) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    style={{ ...provided.draggableProps.style }}
    className="rounded-lg border bg-card p-3 shadow-sm"
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs text-muted-foreground">
        {new Date(todo.date).toLocaleDateString()}
      </p>
      <button
        className="p-0 hover:text-destructive text-muted-foreground"
        onClick={onDelete}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
    <div className="text-center py-2">
      <h3 className="font-semibold text-sm">{todo.title}</h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {todo.description}
      </p>
    </div>
    {todo.statusColor && (
      <Progress value={40} indicatorColor={todo.statusColor} className="mt-2" />
    )}
    <div className="flex items-center gap-2 pt-3">
      <img
        src={todo.author.image}
        alt={todo.author.name}
        className="h-6 w-6 rounded-full object-cover bg-muted"
      />
      <span className="text-xs text-muted-foreground truncate">
        {todo.author.name}
      </span>
    </div>
  </div>
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
      statusColor: "#61A9FF",
      author: { name: "", image: "/static/avatar/001-man.svg" },
    },
    validationSchema: Yup.object({
      title: Yup.string().min(3, "Too short").required("Required"),
      description: Yup.string().min(5, "Too short").required("Required"),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-muted/40 rounded-lg p-2">
      <CustomTextField
        name="title"
        placeholder="Title"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <CustomTextField
        name="author.name"
        placeholder="Author name"
        values={{ "author.name": values.author.name }}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <CustomTextAreaField
        name="description"
        placeholder="Description"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <Button type="submit" size="sm" className="w-full">
        Add
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={onCancel}
      >
        Cancel
      </Button>
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <CustomTextField
        name="name"
        placeholder="Column name"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <Button type="submit" size="sm" className="w-full">
        Add Column
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </form>
  );
};
