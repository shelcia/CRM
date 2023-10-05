import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import DashboardSidenav from "./components/Sidenav";
import Navbar from "./components/Navbar";

const Layout = (props) => {
  return (
    <section className="wrapper">
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <DashboardSidenav />
        <Box sx={{ p: 2, pl: 4, overflow: "hidden" }}>
          <Navbar />
          <Outlet />
        </Box>
      </Box>
    </section>
  );
};

export default Layout;
