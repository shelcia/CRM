import React from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { useState } from "react";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputs = (e, name) => {
    e.preventDefault();
    setUser({ ...user, [`${name}`]: e.target.value });
  };

  const registerUser = () => {
    apiAuth.post({ ...user, role: "admin" }, "register").then((res) => {
      if (res.status === "200") {
        navigate("/verification?status=success");
      } else {
        toast.error("User not created");
      }
    });
  };

  return (
    <>
      <Typography component="h1" variant="h4">
        Register
      </Typography>
      <Alert severity="info" variant="filled" style={{ margin: "0 3px" }}>
        If you want to register as employee or co admin you should ask your
        existing admin to send an invitation email
      </Alert>
      <TextField
        label="Name"
        size="small"
        placeholder="ex: John Doe"
        value={user.name}
        fullWidth
        onChange={(e) => handleInputs(e, "name")}
      />
      <TextField
        label="Email"
        size="small"
        placeholder="ex: james@company.com"
        fullWidth
        value={user.email}
        onChange={(e) => handleInputs(e, "email")}
      />
      <TextField
        label="Password"
        size="small"
        placeholder="enter password"
        fullWidth
        value={user.password}
        onChange={(e) => handleInputs(e, "password")}
      />
      <Button
        variant="contained"
        fullWidth
        className="mt-3"
        onClick={registerUser}
      >
        Register as Admin
      </Button>
      <Box>
        <Link to="/login" style={{ textDecoration: "underline" }}>
          Have account already? then Signin
        </Link>
      </Box>
    </>
  );
};

export default Signup;
