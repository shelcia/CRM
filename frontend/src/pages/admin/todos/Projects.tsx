import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiProvider } from "@/services/utilities/provider";
import { apiUsers } from "@/services/models/usersModel";
import { type Column, type Todo, type TodoAuthor } from "./types";
import reorder from "@/utils/reorder";
import ColumnHeader from "./ColumnHeader";
import TodoCard from "./TodoCard";
import AddTodoForm from "./AddTodoForm";
import AddColumnForm from "./AddColumnForm";

const Projects = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  const [addingColId, setAddingColId] = useState<string | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const controller = new AbortController();
    Promise.all([
      apiProvider.getAll(`projects/${projectId}/board`, controller.signal, true),
      apiUsers.getAll!(controller.signal, true),
    ]).then(([boardRes, usersRes]) => {
      if (Array.isArray(boardRes)) setColumns(boardRes);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, [projectId]);

  // ── Drag and drop ─────────────────────────────────────────────────────────

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "COLUMN") {
      const newColumns = reorder(columns, source.index, destination.index);
      setColumns(newColumns);
      apiProvider.put("projects", { columnIds: newColumns.map((c) => c._id) }, `${projectId}/columns/reorder`, true);
      return;
    }

    const srcColIdx = columns.findIndex((c) => c._id === source.droppableId);
    const dstColIdx = columns.findIndex((c) => c._id === destination.droppableId);
    const srcCol = columns[srcColIdx];
    const dstCol = columns[dstColIdx];

    let updatedColumns: Column[];
    let movedTodo: Todo;

    if (source.droppableId === destination.droppableId) {
      const newTodos = reorder(srcCol.todos, source.index, destination.index);
      updatedColumns = columns.map((c) => (c._id === srcCol._id ? { ...c, todos: newTodos } : c));
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
    apiProvider.post("projects", { name }, `${projectId}/columns`, true).then((res) => {
      if (res?._id) {
        setColumns((prev) => [...prev, { ...res, todos: [] }]);
        setShowAddColumn(false);
      }
    });
  };

  const handleRenameColumn = (colId: string, name: string) => {
    apiProvider.put("projects", { name }, `${projectId}/columns/${colId}`, true).then(() => {
      setColumns((prev) => prev.map((c) => (c._id === colId ? { ...c, name } : c)));
    });
  };

  const handleDeleteColumn = (colId: string) => {
    apiProvider.remove("projects", colId, `${projectId}/columns`, true).then(() => {
      setColumns((prev) => prev.filter((c) => c._id !== colId));
    });
  };

  // ── Todo CRUD ─────────────────────────────────────────────────────────────

  const handleAddTodo = (colId: string, todo: Omit<Todo, "_id" | "date" | "projectId" | "columnId">) => {
    apiProvider.post("projects", { ...todo, columnId: colId }, `${projectId}/todos`, true).then((res) => {
      if (res?._id) {
        setColumns((prev) => prev.map((c) => (c._id === colId ? { ...c, todos: [...c.todos, res] } : c)));
        setAddingColId(null);
      }
    });
  };

  const handleDeleteTodo = (colId: string, todoId: string) => {
    apiProvider.remove("todos", todoId, "", true).then(() => {
      setColumns((prev) =>
        prev.map((c) =>
          c._id === colId ? { ...c, todos: c.todos.filter((t) => t._id !== todoId) } : c,
        ),
      );
    });
  };

  const handleEditTodo = (
    colId: string,
    todoId: string,
    updates: { title: string; description: string; author: TodoAuthor },
  ) => {
    apiProvider.put("todos", updates, todoId, true).then(() => {
      setColumns((prev) =>
        prev.map((c) =>
          c._id === colId
            ? { ...c, todos: c.todos.map((t) => (t._id === todoId ? { ...t, ...updates } : t)) }
            : c,
        ),
      );
    });
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 items-start">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-68">
            <div className="rounded-xl bg-muted/50 border flex flex-col p-3 gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Board ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 items-start">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(boardProvided) => (
            <div ref={boardProvided.innerRef} {...boardProvided.droppableProps} className="flex gap-3 items-start">
              {columns.map((col, idx) => (
                <Draggable draggableId={col._id} index={idx} key={col._id}>
                  {(colProvided, colSnapshot) => (
                    <div
                      ref={colProvided.innerRef}
                      {...colProvided.draggableProps}
                      className="flex-shrink-0 w-68"
                      style={{ ...colProvided.draggableProps.style }}
                    >
                      <div
                        className={cn(
                          "rounded-xl bg-muted/50 border flex flex-col max-h-[calc(100vh-10rem)] transition-shadow",
                          colSnapshot.isDragging && "shadow-xl ring-1 ring-primary/20",
                        )}
                      >
                        <ColumnHeader
                          column={col}
                          dragHandleProps={colProvided.dragHandleProps}
                          onRename={(name) => handleRenameColumn(col._id, name)}
                          onDelete={() => handleDeleteColumn(col._id)}
                          onAddTodo={() => setAddingColId((prev) => (prev === col._id ? null : col._id))}
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
                              {col.todos.map((todo, todoIdx) => (
                                <Draggable draggableId={todo._id} index={todoIdx} key={todo._id}>
                                  {(provided, snapshot) => (
                                    <TodoCard
                                      todo={todo}
                                      provided={provided}
                                      isDragging={snapshot.isDragging}
                                      users={users}
                                      onDelete={() => handleDeleteTodo(col._id, todo._id)}
                                      onEdit={(updates) => handleEditTodo(col._id, todo._id, updates)}
                                    />
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {col.todos.length === 0 && addingColId !== col._id && (
                                <p className="text-xs text-muted-foreground text-center py-4">No tasks yet</p>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {boardProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add column */}
      <div className="flex-shrink-0 w-68">
        {showAddColumn ? (
          <div className="rounded-xl bg-muted/50 border p-3">
            <AddColumnForm onSubmit={handleAddColumn} onCancel={() => setShowAddColumn(false)} />
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowAddColumn(true)}
            className="w-full justify-start gap-2 rounded-xl border border-dashed px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 h-auto"
          >
            <Plus className="h-4 w-4" />
            Add column
          </Button>
        )}
      </div>
    </div>
  );
};

export default Projects;
