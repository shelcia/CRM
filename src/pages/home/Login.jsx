import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { CustomAuthInput } from "../../components/CustomInputs";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <Typography component="h1" variant="h4">
        Log In
      </Typography>
      <CustomAuthInput
        label="Email"
        size="small"
        placeholder="ex: james@company.com"
      />
      <CustomAuthInput
        label="Password"
        size="small"
        type="password"
        placeholder="enter password"
      />
      <Button variant="contained" fullWidth>
        Login
      </Button>
      <Box>
        <Link to="/signup" style={{ textDecoration: "underline" }}>
          No account created? then Signup
        </Link>
      </Box>
    </>
  );
};

export default Login;
