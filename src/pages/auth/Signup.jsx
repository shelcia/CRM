import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { apiAuth } from "../../services/models/authModel";
import { CustomAuthInput } from "../../customcomponents/CustomInputs";
import AuthContainer from "../../layout/auth/AuthContainer";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import Img from "../../assets/illustrations/illustration-lock.jpg";
import MDButtonLoading from "../../components/MDButtonLoading";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 characters required")
      .required("Name is required !"),
    email: Yup.string()
      .email("Enter valid email!")
      .required("Email is required !"),
    password: Yup.string().required("Password is required !"),
    cname: Yup.string().required("Company name is required !"),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    cname: "",
  };
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      registerUser(values);
    },
  });

  const registerUser = (user) => {
    apiAuth.post({ ...user, role: "admin" }, "register").then((res) => {
      if (res.status === "200") {
        navigate("/verification?status=success");
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
        title="Register"
        description="If you want to register as an employee or co-admin, you should ask your existing admin to send an invitation email."
        illustration={Img}
      >
        <MDBox component="form" role="form">
          <MDBox mb={2}>
            <CustomAuthInput
              label="Company Name"
              name="cname"
              placeholder="enter company name"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
          </MDBox>
          <MDBox mb={2}>
            <CustomAuthInput
              label="Name"
              name="name"
              placeholder="enter name"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
          </MDBox>
          <MDBox mb={2}>
            <CustomAuthInput
              label="Email"
              placeholder="enter email"
              name="email"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              type="email"
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

          <MDBox mt={3} mb={1}>
            <MDButtonLoading
              loading={isLoading}
              loadingIndicator="Loading…"
              variant="gradient"
              color="info"
              size="large"
              onClick={handleSubmit}
              fullWidth
            >
              Register as Admin
            </MDButtonLoading>
          </MDBox>
          <MDBox mt={3} textAlign="center">
            <MDTypography variant="button" color="text">
              Have account already? then{" "}
              <MDTypography
                component={Link}
                to="/login"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Signin
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </AuthContainer>
    </>
  );
};

export default Signup;
