import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import {
  CustomSelectChipField,
  CustomSelectField,
  CustomTextField,
} from "../../../components/CustomInputs";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddUser = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required !"),
    email: Yup.string()
      .email("Enter valid email!")
      .required("Email is required !"),
    role: Yup.string(),
    permissions: Yup.array(),
    password: Yup.string().required("Password is required !"),
  });

  const initialValues = {
    name: "",
    email: "",
    role: "employee",
    permissions: ["users-view"],
    password: "",
  };
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      //   loginUser(values);
      inviteUser(values);
    },
  });

  const inviteUser = (values) => {
    console.log(values);
  };

  return (
    <Box component="section">
      <Container>
        <Typography component="h1" variant="h4">
          Add User
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 5,
          }}
        >
          <CustomTextField
            label="Name"
            name="name"
            placeholder="ex: Ram"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
          <CustomTextField
            label="Email"
            name="email"
            placeholder="ex: james@company.com"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
          />
          <CustomSelectField
            label="Role"
            name="role"
            placeholder="role"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            labelItms={[
              { val: "admin", label: "Admin" },
              { val: "manager", label: "Manager" },
              { val: "employee", label: "Employee" },
            ]}
          />
          <CustomSelectChipField
            label="Permissions"
            name="permissions"
            placeholder="permissions"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            labelItms={[
              { val: "users-view", label: "users-view" },
              { val: "users-edit", label: "users-edit" },
              { val: "users-delete", label: "users-delete" },
              { val: "contact-view", label: "contact-view" },
              { val: "contact-edit", label: "contact-edit" },
              { val: "contact-delete", label: "contact-delete" },
              { val: "ticket-view", label: "ticket-view" },
              { val: "ticket-edit", label: "ticket-edit" },
              { val: "ticket-delete", label: "ticket-delete" },
              { val: "todo-view", label: "todo-view" },
              { val: "todo-edit", label: "todo-edit" },
              { val: "todo-delete", label: "todo-delete" },
            ]}
          />
          <CustomTextField
            label="password"
            name="password"
            placeholder="enter password"
            values={values}
            handleChange={handleChange}
            touched={touched}
            errors={errors}
            type="password"
          />
          <Button onClick={handleSubmit}>Invite User</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AddUser;
