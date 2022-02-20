import React from "react";
import { /* Card, */ Toolbar } from "@mui/material";
import CustomBox from "../../../components/CustomBox";
import useTitle from "../../../hooks/useTitle";

const Tickets = () => {
  useTitle("Tickets");

  return (
    <CustomBox
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - 260px)` },
        minHeight: "100vh",
      }}
    >
      <Toolbar />

      {/* <Card className="h-100">
        <CustomBox bgColor={"white"} variant="gradient"></CustomBox>
      </Card> */}
    </CustomBox>
  );
};

export default Tickets;
