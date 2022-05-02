import React, { useState } from "react";
// import Board from "react-trello";

import Board, { moveCard } from "@asseinfo/react-kanban";
// import "@lourenci/react-kanban/dist/styles.css";
import "@asseinfo/react-kanban/dist/styles.css";
import { Avatar } from "@mui/material";

const Todos = () => {
  const board = {
    columns: [
      {
        id: 1,
        title: "Backlog",
        cards: [
          {
            id: 1,
            title: "Card title 1",
            description: "Card content",
          },
          {
            id: 2,
            title: "Card title 2",
            description: "Card content",
          },
          {
            id: 3,
            title: "Card title 3",
            description: "Card content",
          },
        ],
      },
      {
        id: 2,
        title: "Doing",
        cards: [
          {
            id: 9,
            title: "Card title 9",
            description: "Card content",
          },
        ],
      },
      {
        id: 3,
        title: "Q&A",
        cards: [
          {
            id: 10,
            title: "Card title 10",
            description: "Card content",
          },
          {
            id: 11,
            title: "Card title 11",
            description: "Card content",
          },
        ],
      },
      {
        id: 4,
        title: "Production",
        cards: [
          {
            id: 12,
            title: "Card title 12",
            description: "Card content",
          },
          {
            id: 13,
            title: "Card title 13",
            description: "Card content",
          },
        ],
      },
    ],
  };
  const onColumnNew = (item) => {
    const newColumn = { id: "rrrrrr", ...item };
    return newColumn;
  };

  const [controlledBoard, setBoard] = useState(board);

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
  }

  const ColumnAdder = ({ addColumn }) => {
    return (
      <div
      // onClick={() => addColumn({ id: Date.now(), title: "Title", cards: [] })}
      >
        Add column
      </div>
    );
  };

  return (
    <section className="wrapper">
      <Board
        onCardDragEnd={handleCardMove}
        disableColumnDrag
        allowAddColumn
        renderColumnAdder={() => (
          <ColumnAdder
          //   addColumn={addColumn}
          />
        )}
        onColumnNew={onColumnNew}
        renderCard={(
          { title, description },
          { removeColumn, renameColumn, addCard }
        ) => (
          <div className="react-kanban-card">
            <span>
              <div className="react-kanban-card__title">
                <span>{title}</span>
                <span style={{ cursor: "pointer" }}>×</span>
              </div>
            </span>
            <div className="react-kanban-card__description">{description}</div>
            <div className="text-end">
              <Avatar
                alt="Remy Sharp"
                src="/broken-image.jpg"
                sx={{ width: 24, height: 24 }}
              >
                B
              </Avatar>
            </div>
            {/* <button type="button" onClick={removeColumn}>
              Remove Column
            </button>
            <button type="button" onClick={() => renameColumn("New title")}>
              Rename Column
            </button>
            <button
              type="button"
              onClick={() => addCard({ id: 99, title: "New Card" })}
            >
              Add Card
            </button> */}
          </div>
        )}
      >
        {controlledBoard}
      </Board>
    </section>
  );
};

export default Todos;
