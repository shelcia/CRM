import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomAuthInput } from "../../components/CustomInputs";
import { apiAuth } from "../../services/models/authModel";
import { Typography } from "@mui/material";
import { toast } from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      sendRestPwdMail(values);
    },
  });

  const sendRestPwdMail = (body) => {
    apiAuth.post(body, "reset-password").then((res) => {
      if (res.status === "200") {
        toast.success(res.message);
        setIsLoading(false);
      } else {
        toast.error(res.message);
        setIsLoading(false);
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
      <LoadingButton
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        loading={isLoading}
      >
        Reset Password
      </LoadingButton>
    </>
  );
};

export default ForgetPassword;
