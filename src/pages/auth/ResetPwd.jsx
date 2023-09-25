import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { CustomAuthInput } from "../../customcomponents/CustomInputs";
import { apiAuth } from "../../services/models/authModel";
import { useNavigate, useParams } from "react-router-dom";
import MDButtonLoading from "../../components/MDButtonLoading";
import MDBox from "../../components/MDBox";
import AuthContainer from "../../layout/auth/AuthContainer";
import Img from "../../assets/illustrations/illustration-reset.jpg";

const ResetPwd = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      resetPassword({ password: values.password });
    },
  });

  const resetPassword = (password) => {
    apiAuth.put(password, `change-password/${id}`).then((res) => {
      if (res.status === "200") {
        toast.success("Successfully reset");
        navigate("/login");
        setIsLoading(false);
      } else if (res.status === "400") {
        toast.error(res.message);
        setIsLoading(false);
      } else {
        toast.error("Error");
        setIsLoading(false);
      }
    });
  };
  return (
    <>
      <AuthContainer
        title="Reset Password"
        description="Enter your new password to reset"
        illustration={Img}
      >
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            <CustomAuthInput
              label="Passowrd"
              name="password"
              placeholder="enter new password"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              type="password"
            />
          </MDBox>
          <MDBox mb={2}>
            <CustomAuthInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="confirm password"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              type="password"
            />
          </MDBox>
          <MDBox mt={3} mb={1}>
            <MDButtonLoading
              loading={isLoading}
              variant="gradient"
              color="info"
              size="large"
              fullWidth
              onClick={handleSubmit}
            >
              Reset Password
            </MDButtonLoading>
          </MDBox>
        </MDBox>
      </AuthContainer>
      {/* <Typography component="h1" variant="h4">
        Reset Password
      </Typography>
      <CustomAuthInput
        name="password"
        placeholder="enter new password"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
        type="password"
      />
      <CustomAuthInput
        name="confirmPassword"
        placeholder="confirm password"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
        type="password"
      />
      <LoadingButton
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        loading={isLoading}
      >
        Reset Password
      </LoadingButton> */}
    </>
  );
};

export default ResetPwd;
