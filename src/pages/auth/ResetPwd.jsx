import React from "react";
import { Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { CustomAuthInput } from "../../components/CustomInputs";
import { apiAuth } from "../../services/models/authModel";
import { useNavigate, useParams } from "react-router-dom";

const ResetPwd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Minimum 6 characters required")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .min(6, "Minimum 6 characters required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const initialValues = {
    password: "",
    confirmPassword: "",
  };
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      resetPassword({ password: values.password });
    },
  });

  const resetPassword = (password) => {
    apiAuth.put(password, `change-password/${id}`).then((res) => {
      if (res.status === "200") {
        toast.success("Successfully reset");
        navigate("/login");
        // setStatus(true);
      } else if (res.status === "400") {
        toast.error(res.message);
        // setStatus(false);
      } else {
        toast.error("Error");
        // setStatus(false);
      }
      //   setLoading(false);
      //   setIsResponse(true);
    });
  };
  return (
    <>
      <Typography component="h1" variant="h4">
        Reset Password
      </Typography>
      <CustomAuthInput
        name="password"
        placeholder="enter password"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
        type="password"
      />
      <CustomAuthInput
        name="confirmPassword"
        placeholder="enter password"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
        type="password"
      />
      <Button
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
      >
        Reset Password
      </Button>
    </>
  );
};

export default ResetPwd;
