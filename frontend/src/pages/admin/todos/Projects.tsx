import React, { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CustomTextAreaField, CustomTextField } from "@/components/CustomInputs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const todoList = [
  { id: "01", title: "Create Minimal Logo", date: "9/17/2021", description: "Hey, Pixy can we get on a quick call? i need to show you something.", author: { name: "Tom Cruise", image: "/static/avatar/001-man.svg" }, statusColor: "#2499EF" },
  { id: "02", title: "Therapy Session", date: "9/17/2021", description: "Hey, Pixy can we get on a quick call? i need to show you something.", author: { name: "Tom Cruise", image: "/static/avatar/002-girl.svg" }, statusColor: "#FF6B93" },
  { id: "03", title: "Create CDA", date: "9/17/2021", description: "Hey, Pixy can we get on a quick call? i need to show you something.", author: { name: "Tom Cruise", image: "/static/avatar/005-man-1.svg" }, statusColor: "#2499EF" },
  { id: "04", title: "Website UI Design", date: "9/17/2021", description: "Hey, Pixy can we get on a quick call? i need to show you something.", author: { name: "Tom Cruise", image: "/static/avatar/011-man-2.svg" }, statusColor: "#FF9777" },
  { id: "05", title: "Deployment", date: "9/17/2021", description: "Hey, Pixy can we get on a quick call? i need to show you something.", author: { name: "Tom Cruise", image: "/static/avatar/011-man-2.svg" }, statusColor: "#FF9777" },
];

const initialColumns = {
  todo: { name: "To do", todos: todoList.slice(0, 2) },
  progress: { name: "In Progress", todos: [todoList[2]] },
  production: { name: "Production", todos: [todoList[3]] },
  done: { name: "Done", todos: [todoList[4]] },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId === destination.droppableId && source.index === destination.index) return;

  if (source.droppableId !== destination.droppableId) {
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.todos];
    const destItems = [...destCol.todos];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({ ...columns, [source.droppableId]: { ...sourceCol, todos: sourceItems }, [destination.droppableId]: { ...destCol, todos: destItems } });
  } else {
    const col = columns[source.droppableId];
    const items = [...col.todos];
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);
    setColumns({ ...columns, [source.droppableId]: { ...col, todos: items } });
  }
};

const Projects = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => (
          <Card key={index} className="h-full max-h-[700px] flex flex-col">
            <div className="p-3 border-b">
              {columnId === "todo" ? (
                <>
                  <h5 className="font-semibold mb-2">{column.name}</h5>
                  {!showAddTodoForm && (
                    <Button className="w-full" size="sm" onClick={() => setShowAddTodoForm(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                  <AddTodoForm showAddTodoForm={showAddTodoForm} setShowAddTodoForm={setShowAddTodoForm} />
                </>
              ) : (
                <h5 className="font-semibold">{column.name}</h5>
              )}
            </div>

            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 overflow-auto p-3 space-y-3"
                >
                  {column.todos.map((todo, idx) => (
                    <Draggable draggableId={todo.id} index={idx} key={todo.id}>
                      {(provided) => (
                        <TodoCard todo={todo} provided={provided} />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Card>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Projects;

const AddTodoForm = ({ showAddTodoForm, setShowAddTodoForm }) => {
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { title: "", date: "", description: "", statusColor: "#61A9FF", mentionClient: "" },
    validationSchema: Yup.object().shape({
      title: Yup.string().min(3, "Too Short").required("Title is Required!"),
      date: Yup.date().required("Date is Required!"),
      description: Yup.string().min(10, "Too Short").required("Description is Required!"),
    }),
    onSubmit: () => setShowAddTodoForm(false),
  });

  if (!showAddTodoForm) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <CustomTextField name="title" placeholder="Title" values={values} handleChange={handleChange} touched={touched} errors={errors} />
      <CustomTextField name="mentionClient" placeholder="@mention Client" values={values} handleChange={handleChange} touched={touched} errors={errors} />
      <CustomTextAreaField name="description" placeholder="Description" values={values} handleChange={handleChange} touched={touched} errors={errors} />
      <Button type="submit" className="w-full" size="sm">Save</Button>
      <Button type="button" variant="ghost" className="w-full" size="sm" onClick={() => setShowAddTodoForm(false)}>
        Cancel
      </Button>
    </form>
  );
};

const TodoCard = ({ todo, provided }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    style={{ ...provided.draggableProps.style }}
    className="rounded-lg border bg-card p-3 shadow-sm"
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs text-muted-foreground">{todo.date}</p>
      <button className="p-0 hover:text-foreground text-muted-foreground">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
    <div className="text-center py-4">
      <h3 className="font-semibold">{todo.title}</h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{todo.description}</p>
    </div>
    <div className="flex justify-between text-xs text-muted-foreground mb-1">
      <span>Project Progress</span>
      <span>32%</span>
    </div>
    <Progress value={32} indicatorColor={todo.statusColor} />
    <div className="flex items-center justify-between pt-3">
      <button className="text-primary">
        <Plus className="h-4 w-4" />
      </button>
      <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground font-semibold">
        3 Weeks Left
      </span>
    </div>
  </div>
);
