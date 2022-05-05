import React, { useState } from "react";
import Board, {
  addCard,
  moveCard,
  removeCard,
  addColumn,
  moveColumn,
  removeColumn,
} from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import { Avatar, Button, IconButton } from "@mui/material";
import { Trash2, Edit2, Eye } from "react-feather";
import CustomModal from "../../../components/CustomModal";
import { CustomDarkInput } from "../../../components/CustomInputs";
import CustomSunEditor from "../../../components/CustomSunEditor";

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
    setBoard(updatedBoard);
    setAddCardModal(false);
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

  const handleAddColumn = (columnName) => {
    const updatedBoard = addColumn(controlledBoard, {
      id: Date.now(),
      title: columnName ? columnName : "New Column",
      cards: [],
    });
    setBoard(updatedBoard);
    setAddColumnModal(false);
  };

  const handleColumnMove = (_card, source, destination) => {
    const updatedBoard = moveColumn(controlledBoard, source, destination);
    setBoard(updatedBoard);
  };

  const handleRemoveColumn = (column) => {
    const updatedBoard = removeColumn(controlledBoard, column);
    setBoard(updatedBoard);
  };

  //modal states

  const [addColumnModal, setAddColumnModal] = useState(false);
  const [addCardModal, setAddCardModal] = useState(false);

  const [tasks, setTasks] = useState({
    title: "",
    description: "",
  });

  const handleTaskInputs = (e) => {
    const { name, value } = e.target;
    setTasks({ ...tasks, [name]: value });
  };

  return (
    <section className="wrapper">
      <div>
        <Button
          onClick={() => setAddColumnModal(true)}
          variant="contained"
          size="small"
        >
          Add Column
        </Button>
        <AddColumnModal
          addColumnModal={addColumnModal}
          setAddColumnModal={setAddColumnModal}
          handleAddColumn={handleAddColumn}
        />
      </div>

      <Board
        onCardDragEnd={handleCardMove}
        onColumnDragEnd={handleColumnMove}
        renderColumnHeader={(column) => {
          return (
            <React.Fragment>
              <div className="d-flex justify-content-between align-items-center">
                <p> {column?.title}</p>
                <div>
                  <IconButton
                    onClick={() => handleRemoveColumn(column)}
                    size="small"
                  >
                    <Edit2 strokeWidth={1.5} size={15} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemoveColumn(column)}
                    size="small"
                  >
                    <Trash2 strokeWidth={1.5} size={15} />
                  </IconButton>
                </div>
              </div>
              <br />
              <button
                type="button"
                className="react-kanban-card-adder-button"
                onClick={() => setAddCardModal(true)}
              >
                +
              </button>
              <AddCardModal
                addCardModal={addCardModal}
                setAddCardModal={setAddCardModal}
                handleAddCard={handleAddCard}
                column={column}
                inputs={tasks}
                setInputs={setTasks}
                handleInputs={handleTaskInputs}
              />
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
        </div>
      </span>
      <div className="react-kanban-card__description">{card.description}</div>
      <div className="d-flex justify-content-between align-items-center">
        <Avatar
          alt="Remy Sharp"
          src="/broken-image.jpg"
          sx={{ width: 24, height: 24 }}
        >
          B
        </Avatar>
        <div>
          <IconButton onClick={() => handleRemoveCard(card)} size="small">
            <Eye strokeWidth={1.5} size={13} />
          </IconButton>
          <IconButton
            onClick={() => handleRemoveCard(card)}
            size="small"
            color="info"
          >
            <Edit2 strokeWidth={1.5} size={13} />
          </IconButton>
          <IconButton
            onClick={() => handleRemoveCard(card)}
            size="small"
            color="error"
          >
            <Trash2 strokeWidth={1.5} size={15} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const AddColumnModal = ({
  addColumnModal,
  setAddColumnModal,
  handleAddColumn,
}) => {
  const [value, setValue] = useState("");
  return (
    <CustomModal
      open={addColumnModal}
      onClose={() => setAddColumnModal(false)}
      title="Add Column"
    >
      <CustomDarkInput
        label="Column Name"
        size="small"
        placeholder="ex: Production"
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />

      <Button
        onClick={() => handleAddColumn(value)}
        variant="contained"
        size="small"
        className="mt-3"
      >
        Add Column
      </Button>
    </CustomModal>
  );
};

const AddCardModal = ({
  addCardModal,
  setAddCardModal,
  handleAddCard,
  column,
  inputs,
  setInputs,
  handleInputs,
}) => {
  // const [value, setValue] = useState("");

  return (
    <CustomModal
      open={addCardModal}
      onClose={() => setAddCardModal(false)}
      title="Add Task"
    >
      <CustomDarkInput
        label="Task Title"
        size="small"
        placeholder="ex: Production"
        fullWidth
        name="title"
        value={inputs.title}
        onChange={handleInputs}
      />
      <CustomSunEditor
        inputs={inputs}
        setInputs={setInputs}
        name="description"
      />
      <CustomDarkInput label="Priority" size="small" fullWidth />
      <CustomDarkInput
        label="Label"
        size="small"
        placeholder="ex: Production"
        fullWidth
      />
      <CustomDarkInput
        label="Estimate in days"
        size="small"
        placeholder="ex: Production"
        fullWidth
      />
      <CustomDarkInput
        label="Start Date"
        size="small"
        placeholder="ex: Production"
        fullWidth
      />

      <Button
        onClick={() => handleAddCard(column)}
        variant="contained"
        size="small"
        className="mt-3"
      >
        Add Task
      </Button>
    </CustomModal>
  );
};
