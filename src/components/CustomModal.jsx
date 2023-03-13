import React from "react";
import { Card, Modal, styled } from "@mui/material";

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
  // backgroundColor: "#27293d",
  //   backgroundColor: "#f3f4f9",
}));

const CustomModal = ({ open = false, onClose, title, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalCard>
        <h2 className="mb-2">{title}</h2>
        <Card className="p-3" elevation={0}>
          {children}
        </Card>
      </StyledModalCard>
    </Modal>
  );
};

export default CustomModal;
