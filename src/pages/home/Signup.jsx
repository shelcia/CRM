import React from "react";
import { Alert, Button, Card, CardContent, TextField } from "@mui/material";
import TopImg from "../../assets/card-primary.webp";
// import { CustomAuthInput } from "../../components/CustomInputs";
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
    apiAuth.post({ ...user, type: "admin" }).then((res) => {
      if (res.status === "200") {
        localStorage.setItem("CRM-id", res.message.id);
        localStorage.setItem("CRM-name", res.message.name);
        localStorage.setItem("CRM-email", res.message.email);
        localStorage.setItem("CRM-type", res.message.type);
        localStorage.setItem("CRM-token", res.message.token);

        navigate("/admin_dashboard/contacts");
      } else {
        toast.error("User not created");
      }
    });
  };

  return (
    <section className="wrapper">
      <div className="d-flex justify-content-center align-items-center h-100">
        <Card className="auth-card">
          <h1 className="auth-title">register</h1>
          <img src={TopImg} alt="" />
          <Alert severity="info" variant="filled" style={{ margin: "0 3px" }}>
            If you want to register as employee or co admin you should ask your
            existing admin to send an invitation email
          </Alert>
          <CardContent>
            <TextField
              label="Name"
              size="small"
              placeholder="ex: John Doe"
              value={user.name}
              fullWidth
              onChange={(e) => handleInputs(e, "name")}
            />
            <TextField
              label="Name"
              size="small"
              placeholder="ex: james@company.com"
              fullWidth
              value={user.email}
              onChange={(e) => handleInputs(e, "email")}
            />
            <TextField
              label="Name"
              size="small"
              placeholder="enter password"
              fullWidth
              value={user.password}
              onChange={(e) => handleInputs(e, "password")}
            />
            {/* <CustomAuthInput
              label="Name"
              size="small"
              placeholder="ex: John Doe"
              value={user.name}
              onChange={(e) => handleInputs(e, "name")}
            />
            <CustomAuthInput
              label="Email"
              size="small"
              type="email"
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
            /> */}
            <Button
              variant="contained"
              fullWidth
              className="mt-3"
              onClick={registerUser}
            >
              Register as Admin
            </Button>
            <div className="mt-3">
              <Link to="/login">Have account already? then Signin</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Signup;
