import React, { useContext } from "react";
import { Card, Modal, styled } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";

export const StyledModalCard = styled(Card)(({ theme }) => ({
  top: "50%",
  left: "50%",
  maxWidth: 700,
  minWidth: 300,
  maxHeight: "80vh",
  overflowY: "scroll",
  position: "absolute",
  padding: "1.5rem",
  boxShadow: theme.shadows[2],
  transform: "translate(-50%, -50%)",
  width: "100%",
  outline: "none",
  backgroundColor: theme === "dark" ? "#27293d" : "#f3f4f9",
}));

const CustomModal = ({ open = false, onClose, title, children }) => {
  const [darkTheme] = useContext(ThemeContext);

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalCard
        sx={{ backgroundColor: darkTheme ? "#27293d" : "#f3f4f9" }}
      >
        <h2 className="mb-2">{title}</h2>
        <Card className="p-3" elevation={0}>
          {children}
        </Card>
      </StyledModalCard>
    </Modal>
  );
};

export default CustomModal;
