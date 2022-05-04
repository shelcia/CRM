import React from "react";
import { Button, Card, CardContent } from "@mui/material";
import TopImg from "../../assets/card-primary.webp";
import { CustomAuthInput } from "../../components/CustomInputs";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="wrapper">
      <div className="d-flex justify-content-center align-items-center h-100">
        <Card className="auth-card">
          <h1 className="auth-title">log in</h1>
          <img src={TopImg} alt="" />
          <CardContent>
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
            <Button variant="contained" fullWidth className="mt-3">
              Login
            </Button>
            <div className="mt-3">
              <Link to="/signup">No account created? then Signup</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Login;
