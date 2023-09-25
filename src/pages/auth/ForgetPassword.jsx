import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomAuthInput } from "../../customcomponents/CustomInputs";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";
// import { LoadingButton } from "@mui/lab";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import { Link } from "react-router-dom";
// import MDButton from "../../components/MDButton";
import AuthContainer from "../../layout/auth/AuthContainer";
import Img from "../../assets/illustrations/illustration-reset.jpg";
import MDButtonLoading from "../../components/MDButtonLoading";

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
      <AuthContainer
        title="Reset Password"
        description="Enter your email and password to sign in"
        illustration={Img}
      >
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            <CustomAuthInput
              label="Email"
              name="email"
              placeholder="ex: james@company.com"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
          </MDBox>
          <MDBox mt={3} mb={1}>
            {/* <MDButton
              variant="gradient"
              color="info"
              size="large"
              fullWidth
              onClick={handleSubmit}
            >
              Reset Password
            </MDButton> */}
            <MDButtonLoading
              onClick={handleSubmit}
              variant="gradient"
              color="info"
              size="large"
              fullWidth
              loading={isLoading}
            >
              Reset Password
            </MDButtonLoading>
          </MDBox>
          <MDBox mt={3} textAlign="center">
            <MDTypography variant="button" color="text">
              Remember it now? then{" "}
              <MDTypography
                component={Link}
                to="/login"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign in
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </AuthContainer>
      {/* <Typography component="h1" variant="h4">
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
      </LoadingButton> */}
    </>
  );
};

export default ForgetPassword;
