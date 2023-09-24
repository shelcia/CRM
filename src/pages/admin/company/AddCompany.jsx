import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { CustomTextField } from "../../../components/CustomInputs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";

const AddCompany = () => {
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Minimum 6 characters required")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .min(6, "Minimum 6 characters required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const initialValues = {
    name: "",
    website: "",
    number: 0,
  };
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      //   setIsLoading(true);
    },
  });

  return (
    <>
      <Typography component="h1" variant="h3">
        Add Company
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent
            sx={{ p: 5, display: "flex", gap: 2, flexDirection: "column" }}
          >
            <CustomTextField
              name="name"
              label="Name"
              placeholder="enter name"
              values={values.name}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              name="website"
              label="Website"
              placeholder="enter website"
              values={values.website}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              name="number"
              label="Number"
              placeholder="enter number"
              values={values.number}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              type="number"
            />
            <LoadingButton
              onClick={handleSubmit}
              variant="contained"
              sx={{ mt: 3 }}
            >
              Add Company
            </LoadingButton>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default AddCompany;
