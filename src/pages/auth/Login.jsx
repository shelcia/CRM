import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomAuthInput } from "../../components/CustomInputs";
import { apiAuth } from "../../services/models/authModel";

const Login = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter valid email!")
      .required("Email is required !"),
    password: Yup.string().required("Password is required !"),
  });

  const initialValues = {
    email: "",
    password: "",
  };
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      loginUser(values);
    },
  });
  const loginUser = (user) => {
    apiAuth.post(user, "login").then((res) => {
      if (res.status === "200") {
        // navigate("/verification");
        localStorage.setItem("CRM-id", res.message.id);
        localStorage.setItem("CRM-name", res.message.name);
        localStorage.setItem("CRM-email", res.message.email);
        localStorage.setItem("CRM-type", res.message.type);
        localStorage.setItem("CRM-token", res.message.token);

        if (res.message.companyId) {
          navigate("/admin_dashboard/contacts");
        } else {
          navigate("/admin_dashboard/add-company");
          localStorage.setItem("CRM-companyId", res.message.companyId);
          localStorage.setItem("CRM-company", res.message.company);
        }
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
        name="email"
        placeholder="ex: james@company.com"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <CustomAuthInput
        name="password"
        placeholder="enter password"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
        type="password"
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Login
      </Button>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Link to="/signup" style={{ textDecoration: "underline" }}>
          No account created? then Signup
        </Link>
        <Link to="/forget-password" style={{ textDecoration: "underline" }}>
          Forgot Password?
        </Link>
      </Box>
    </>
  );
};

export default Login;
