import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomAuthInput } from "../../components/CustomInputs";
import { apiAuth } from "../../services/models/authModel";
import { Button, Typography } from "@mui/material";
import { toast } from "react-hot-toast";

const ForgetPassword = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter valid email!")
      .required("Email is required !"),
  });

  const initialValues = {
    email: "",
  };
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      sendRestPwdMail(values);
    },
  });

  const sendRestPwdMail = (body) => {
    apiAuth.post(body, "reset-password").then((res) => {
      if (res.status === "200") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };
  return (
    <>
      <Typography component="h1" variant="h4">
        Reset Password
      </Typography>
      <CustomAuthInput
        name="email"
        placeholder="ex: james@company.com"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
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

export default ForgetPassword;
