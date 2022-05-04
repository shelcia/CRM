import React, { useState } from "react";
import Board, {
  addCard,
  moveCard,
  removeCard,
  moveColumn,
  removeColumn,
} from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import { Avatar, IconButton } from "@mui/material";
import { Trash2 } from "react-feather";

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

  const [controlledBoard, setBoard] = useState(board);

  const handleAddCard = (column) => {
    const updatedBoard = addCard(controlledBoard, column, {
      id: Date.now(),
      title: "New Card 1",
      description: "Card content",
    });
    console.log(updatedBoard);
    setBoard(updatedBoard);
  };

  const handleCardMove = (_card, source, destination) => {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
  };

  const handleRemoveCard = (card) => {
    const fromColumn = controlledBoard.columns.filter((column) =>
      column.cards.map((item) => item.id).includes(card.id)
    );
    if (fromColumn.length === 0) return;
    const updatedBoard = removeCard(controlledBoard, fromColumn[0], card);
    setBoard(updatedBoard);
  };

  const handleColumnMove = (_card, source, destination) => {
    const updatedBoard = moveColumn(controlledBoard, source, destination);
    setBoard(updatedBoard);
  };

  const handleRemoveColumn = (column) => {
    const updatedBoard = removeColumn(controlledBoard, column);
    setBoard(updatedBoard);
  };

  return (
    <section className="wrapper">
      <Board
        onCardDragEnd={handleCardMove}
        onColumnDragEnd={handleColumnMove}
        renderColumnHeader={(column) => {
          return (
            <React.Fragment>
              <div className="d-flex justify-content-between align-items-center">
                <p> {column?.title}</p>

                <IconButton
                  onClick={() => handleRemoveColumn(column)}
                  size="small"
                >
                  <Trash2 strokeWidth={1.5} size={15} />
                </IconButton>
              </div>
              <br />
              <button
                type="button"
                className="react-kanban-card-adder-button"
                onClick={() => handleAddCard(column)}
              >
                +
              </button>
            </React.Fragment>
          );
        }}
        renderCard={(card) => (
          <KanbanCard card={card} handleRemoveCard={handleRemoveCard} />
        )}
      >
        {controlledBoard}
      </Board>
    </section>
  );
};

export default Todos;

const KanbanCard = ({ card, handleRemoveCard }) => {
  //   console.log(card);
  return (
    <div className="react-kanban-card">
      <span>
        <div className="react-kanban-card__title">
          <span>{card.title}</span>
          <IconButton onClick={() => handleRemoveCard(card)} size="small">
            <Trash2 strokeWidth={1.5} size={15} />
          </IconButton>
        </div>
      </span>
      <div className="react-kanban-card__description">{card.description}</div>
      <div className="text-end">
        <Avatar
          alt="Remy Sharp"
          src="/broken-image.jpg"
          sx={{ width: 24, height: 24 }}
        >
          B
        </Avatar>
      </div>
    </div>
  );
};
