import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { CustomAuthInput } from "../../components/CustomInputs";
import { Link, useNavigate } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInputs = (e, name) => {
    // e.preventDefault();
    setUser({ ...user, [`${name}`]: e.target.value });
  };

  const loginUser = () => {
    apiAuth.post(user, "login").then((res) => {
      if (res.status === "200") {
        // navigate("/verification");
        localStorage.setItem("CRM-id", res.message.id);
        localStorage.setItem("CRM-name", res.message.name);
        localStorage.setItem("CRM-email", res.message.email);
        localStorage.setItem("CRM-type", res.message.type);
        localStorage.setItem("CRM-token", res.message.token);

        navigate("/admin_dashboard/contacts");
      } else if (res.status === "401") {
        localStorage.setItem("CRM-email", user.email);
        navigate("/verification?status=not-verified");
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <>
      <Typography component="h1" variant="h4">
        Log In
      </Typography>
      <CustomAuthInput
        label="Email"
        size="small"
        placeholder="ex: james@company.com"
        value={user.email}
        onChange={(e) => handleInputs(e, "email")}
      />
      <CustomAuthInput
        label="Password"
        size="small"
        type="password"
        placeholder="enter password"
        value={user.password}
        onChange={(e) => handleInputs(e, "password")}
      />
      <Button variant="contained" fullWidth onClick={loginUser}>
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
