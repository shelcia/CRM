import React, { useState } from "react";
import {
  AvatarGroup,
  Box,
  Button,
  Card,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup"; // component props interface
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const todoList = [
  {
    id: "01",
    title: "Create Minimal Logo",
    date: "9/17/2021",
    description:
      "Hey, Pixy can we get on a quick call? i need to show you something. You need to do some work for me ASAP. And you need to do it before Aug 25. Thanks get back to me.",
    author: {
      name: "Tom Cruise",
      image: "/static/avatar/001-man.svg",
    },
    statusColor: "primary.main",
  },
  {
    id: "02",
    title: "Therapy Session",
    date: "9/17/2021",
    description:
      "Hey, Pixy can we get on a quick call? i need to show you something. You need to do some work for me ASAP. And you need to do it before Aug 25. Thanks get back to me.",
    author: {
      name: "Tom Cruise",
      image: "/static/avatar/002-girl.svg",
    },
    statusColor: "primary.red",
  },
  {
    id: "03",
    title: "Create Minimal Logo",
    date: "9/17/2021",
    description:
      "Hey, Pixy can we get on a quick call? i need to show you something. You need to do some work for me ASAP. And you need to do it before Aug 25. Thanks get back to me.",
    author: {
      name: "Tom Cruise",
      image: "/static/avatar/005-man-1.svg",
    },
    statusColor: "primary.main",
  },
  {
    id: "04",
    title: "Website UI Design",
    date: "9/17/2021",
    description:
      "Hey, Pixy can we get on a quick call? i need to show you something. You need to do some work for me ASAP. And you need to do it before Aug 25. Thanks get back to me.",
    author: {
      name: "Tom Cruise",
      image: "/static/avatar/011-man-2.svg",
    },
    statusColor: "primary.yellow",
  },
];
const viewColumns = {
  todo: {
    name: "To do",
    todos: todoList.slice(0, 2),
  },
  progress: {
    name: "In Progress",
    todos: [todoList[2]],
  },
  production: {
    name: "Production",
    todos: [todoList[2]],
  },
  done: {
    name: "Done",
    todos: [todoList[3]],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  }

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.todos];
    const destItems = [...destColumn.todos];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, todos: sourceItems },
      [destination.droppableId]: { ...destColumn, todos: destItems },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.todos];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: { ...column, todos: copiedItems },
    });
  }
};

const Projects = () => {
  const [columns, setColumns] = useState(viewColumns);
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  return (
    <Grid container spacing={3}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  maxHeight: 700,
                }}
              >
                {columnId === "todo" ? (
                  <Box padding="1rem">
                    <h5>{column.name}</h5>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setShowAddTodoForm(true)}
                      sx={{
                        marginY: "1rem",
                        display: showAddTodoForm ? "none" : "auto",
                      }}
                    >
                      +{/* <Add /> */}
                    </Button>
                    <AddTodoForm
                      showAddTodoForm={showAddTodoForm}
                      setShowAddTodoForm={setShowAddTodoForm}
                    />
                  </Box>
                ) : (
                  <h5 style={{ padding: "1rem" }}>{column.name}</h5>
                )}

                <Droppable droppableId={columnId}>
                  {(provided) => {
                    return (
                      <DroppableWrapper
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {column.todos.map((todo, index) => {
                          return (
                            <Draggable
                              draggableId={todo.id}
                              index={index}
                              key={todo.id}
                            >
                              {(provided) => {
                                return (
                                  <Card
                                    key={todo.id}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{ ...provided.draggableProps.style }}
                                    sx={{
                                      boxShadow: 2,
                                      padding: "1rem",
                                      marginBottom: "1.5rem",
                                    }}
                                  >
                                    <Box
                                      alignItems="center"
                                      justifyContent="space-between"
                                    >
                                      <p>July 2, 2020</p>
                                      <IconButton
                                        sx={{
                                          padding: 0,
                                        }} // onClick={handleMoreClick}
                                      >
                                        <MoreHoriz />
                                      </IconButton>
                                    </Box>

                                    <Box
                                      sx={{
                                        textAlign: "center",
                                        pt: 6,
                                        pb: 4,
                                      }}
                                    >
                                      <h3>Web Designing</h3>
                                      <h6
                                      // color="text.disabled"
                                      // fontWeight={500}
                                      // mt={0.5}
                                      >
                                        Prototyping
                                      </h6>
                                    </Box>

                                    <Box justifyContent="space-between" py={1}>
                                      <p fontWeight={600}>Project Progress</p>
                                      <p fontWeight={600}>32%</p>
                                    </Box>

                                    <LinearProgress
                                      value={32}
                                      variant="determinate"
                                      sx={{
                                        "& .MuiLinearProgress-bar": {
                                          backgroundColor: todo.statusColor,
                                        },
                                      }}
                                    />

                                    <Box
                                      alignItems="center"
                                      justifyContent="space-between"
                                      pt="1.5rem"
                                    >
                                      <Box alignItems="center">
                                        <AvatarGroup>
                                          {/* <UkoAvatar alt="Remy Sharp" src="/static/avatar/001-man.svg" /> */}
                                          {/* <UkoAvatar alt="Travis Howard" src="/static/avatar/002-girl.svg" /> */}
                                        </AvatarGroup>
                                        +
                                        {/* <AddIconButton
                                          sx={{
                                            marginLeft: 0,
                                          }}
                                        /> */}
                                      </Box>

                                      <Typography
                                        sx={{
                                          backgroundColor: "divider",
                                          padding: "5px 15px",
                                          borderRadius: "20px",
                                          marginLeft: 1,
                                          color: "text.disabled",
                                          fontWeight: 600,
                                        }}
                                      >
                                        3 Weeks Left
                                      </Typography>
                                    </Box>
                                  </Card>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </DroppableWrapper>
                    );
                  }}
                </Droppable>
              </Card>
            </Grid>
          );
        })}
      </DragDropContext>
    </Grid>
  );
};

export default Projects;

export const DroppableWrapper = styled(Box)(() => ({
  maxHeight: "calc(100% - 53px)",
  minHeight: "calc(100% - 53px)",
  padding: "1rem",
  overflow: "auto",
  "&[data-rbd-droppable-id='todo']": {
    maxHeight: "calc(100% - 129px)",
    minHeight: "calc(100% - 129px)",
  },
}));
export const ColorDot = styled(Box)(({ color }) => ({
  width: 6,
  height: 6,
  marginTop: 6,
  marginRight: 10,
  borderRadius: "50%",
  backgroundColor: color,
}));

const AddTodoForm = (props) => {
  const { showAddTodoForm, setShowAddTodoForm } = props; // form field validation

  const validationSchema = Yup.object().shape({
    title: Yup.string().min(3, "Too Short").required("Title is Required!"),
    date: Yup.date().required("Date is Required!"),
    description: Yup.string()
      .min(10, "Too Short")
      .required("Description is Required!"),
  });
  const initialValues = {
    title: "",
    date: "",
    description: "",
    statusColor: "#61A9FF",
    mentionClient: "",
  };
  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    touched /*setFieldValue*/,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setShowAddTodoForm(false);
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          marginTop: 2,
          display: showAddTodoForm ? "auto" : "none",
        }}
      >
        <TextField
          fullWidth
          name="title"
          placeholder="Title"
          value={values.title}
          onChange={handleChange}
          helperText={touched.title && errors.title}
          error={Boolean(touched.title && errors.title)}
          sx={{
            mb: 1,
          }}
        />

        {/* <DatePicker
          value={values.date}
          onChange={(newDate) => setFieldValue("date", newDate)}
          renderInput={(params) => (
            <TextField
              {...params}
              name="date"
              fullWidth
              error={Boolean(touched.date && errors.date)}
              helperText={touched.date && errors.date}
              sx={{
                mb: 1,
                "& .MuiSvgIcon-root": {
                  color: "text.disabled",
                },
              }}
            />
          )}
        /> */}
        <TextField
          fullWidth
          name="mentionClient"
          placeholder="@mention Client"
          onChange={handleChange}
          value={values.mentionClient}
          sx={{
            mb: 1,
          }}
        />
        <TextField
          fullWidth
          rows={5}
          multiline
          name="description"
          placeholder="Description"
          value={values.description}
          onChange={handleChange}
          error={Boolean(touched.description && errors.description)}
          helperText={touched.description && errors.description}
          sx={{
            "& .MuiOutlinedInput-root": {
              padding: 0,
              "& textarea": {
                paddingY: 1,
              },
            },
          }}
        />

        <Box alignItems="center" mb="1rem">
          <FormLabel
            component="small"
            sx={{
              color: "text.disabled",
            }}
          >
            Select Color
          </FormLabel>
          <RadioGroup
            row
            name="statusColor"
            value={values.statusColor}
            onChange={handleChange}
          >
            <Radio value="#61A9FF" size="small" color="primary" />
            <Radio value="#2CC5BD" size="small" color="success" />
            <Radio value="#FD396D" size="small" color="error" />
            <Radio value="#A798FF" size="small" color="info" />
          </RadioGroup>
        </Box>

        <Box>
          <Button variant="contained" fullWidth type="submit">
            Save
          </Button>
          <Box width="2rem" />
          <Button
            fullWidth
            onClick={() => setShowAddTodoForm(false)}
            sx={{
              backgroundColor: "secondary.300",
              color: "text.disabled",
              "&:hover": {
                backgroundColor: "secondary.300",
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
};
