import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomAuthInput } from "../../customcomponents/CustomInputs";
import { apiAuth } from "../../services/models/authModel";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";
import AuthContainer from "../../layout/auth/AuthContainer";
import Img from "../../assets/illustrations/illustration-lock.jpg";

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
          navigate("/dashboard/contacts");
        } else {
          navigate("/dashboard/add-company");
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
      <AuthContainer
        title="Sign In"
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
          <MDBox mb={2}>
            <CustomAuthInput
              label="Password"
              name="password"
              placeholder="enter password"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              type="password"
            />
          </MDBox>
          <MDBox mb={0} textAlign="right">
            <MDTypography variant="button" color="text">
              <MDTypography
                component={Link}
                to="/forget-password"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Forgot Password?
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mt={3} mb={1}>
            <MDButton
              variant="gradient"
              color="info"
              size="large"
              fullWidth
              onClick={handleSubmit}
            >
              sign in
            </MDButton>
          </MDBox>
          <MDBox mt={3} textAlign="center">
            <MDTypography variant="button" color="text">
              Don&apos;t have an account?{" "}
              <MDTypography
                component={Link}
                to="/signup"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign up
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </AuthContainer>
    </>
  );
};

export default Login;
