import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import MDButton from "../../components/MDButton";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <Box component="section">
      <Box>
        <Typography variant="h1" component="h1" sx={{ mb: 2 }} align="center">
          Easy CRM for Your Basic CRM needs
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ mb: 2, color: red[500] }}
          align="center"
        >
          * Under development
        </Typography>
        <Box align="center">
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => navigate("/login")}
          >
            Login
          </MDButton>
          <MDButton
            variant="gradient"
            color="light"
            onClick={() => navigate("/signup")}
            sx={{ ml: 1 }}
          >
            Get started
          </MDButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
