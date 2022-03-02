import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Toolbar } from "@mui/material";
import CustomButton from "../../../components/CustomButton";
import CustomTypography from "../../../components/CustomTypography";
import CustomBox from "../../../components/CustomBox";
import boxShadow from "../../../theme/functions/boxShadow";
import colors from "../../../theme/base/colors";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

function QuoteApp() {
  const [boards, setBoards] = useState([
    [
      {
        createdAt: "2022-03-01T10:45:06.620Z",
        title: "qui",
        desc: "Enim et officiis maxime magnam quia vitae asperiores qui.",
        deadline: "2022-09-07T12:56:17.145Z",
        assignedTo: ["Jim"],
        comments: ["eee"],
        id: "1",
      },
      {
        createdAt: "2022-02-28T17:49:01.306Z",
        title: "tempora",
        desc: "Fugit voluptatem aut aspernatur rerum.",
        deadline: "2023-02-02T09:03:00.989Z",
        assignedTo: ["Jim"],
        comments: ["eee"],
        id: "2",
      },
    ],
    [
      {
        createdAt: "2022-03-01T10:45:06.620Z",
        title: "qui",
        desc: "Enim et officiis maxime magnam quia vitae asperiores qui.",
        deadline: "2022-09-07T12:56:17.145Z",
        assignedTo: ["Jim"],
        comments: ["eee"],
        id: "3",
      },
      {
        createdAt: "2022-02-28T17:49:01.306Z",
        title: "tempora",
        desc: "Fugit voluptatem aut aspernatur rerum.",
        deadline: "2023-02-02T09:03:00.989Z",
        assignedTo: ["Jim"],
        comments: ["eee"],
        id: "4",
      },
    ],
  ]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(boards[sInd], source.index, destination.index);
      const newState = [...boards];
      newState[sInd] = items;
      setBoards(newState);
    } else {
      const result = move(boards[sInd], boards[dInd], source, destination);
      const newState = [...boards];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setBoards(newState.filter((group) => group.length));
    }
  }

  const { black } = colors;

  return (
    <CustomBox
      sx={{
        p: 3,
        width: { sm: `calc(100% - 260px)` },
        minHeight: "100vh",
        overflow: "scroll",
      }}
    >
      <Toolbar />
      <div className="text-end mb-3">
        <CustomButton
          onClick={() => {
            setBoards([...boards, []]);
          }}
          color="info"
          variant="gradient"
        >
          Add new Board
        </CustomButton>
      </div>

      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {boards.map((todos, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver
                      ? "rgba(26, 31, 55, 0.6)"
                      : "radial-gradient(94.43% 69.43% at 50% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%) transparent",
                    padding: grid,
                    width: 250,
                  }}
                  // style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                  className="me-2"
                  sx={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CustomTypography color="white" variant="gradient">
                    Title
                  </CustomTypography>
                  {todos.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            padding: grid * 2,
                            margin: `0 0 ${grid}px 0`,

                            // change background colour if dragging
                            background: snapshot.isDragging
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(255, 255, 255, 0.4)",

                            // styles we need to apply on draggables
                            ...provided.draggableProps.style,
                            boxShadow: `${boxShadow(
                              [0, 8],
                              [26, -4],
                              black.light,
                              0.15
                            )}, ${boxShadow(
                              [0, 8],
                              [9, -5],
                              black.light,
                              0.06
                            )}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            {item?.title}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <CustomButton
                    variant="gradient"
                    color="dark"
                    fullWidth
                    className="mt-5"
                  >
                    Add Item
                  </CustomButton>
                  {/* {provided.placeholder} */}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </CustomBox>
  );
}

export default QuoteApp;

// {/* <button
//                     type="button"
//                     onClick={() => {
//                       const newState = [...state];
//                       newState[ind].splice(index, 1);
//                       setState(
//                         newState.filter((group) => group.length)
//                       );
//                     }}
//                   >
//                     delete
//                   </button> */}
