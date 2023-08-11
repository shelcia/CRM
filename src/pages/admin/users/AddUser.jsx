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
            labelItms={[
              { val: "users-view", label: "Users view" },
              { val: "users-edit", label: "Users-edit" },
              { val: "users-delete", label: "Users-delete" },
              { val: "contact-view", label: "Contact-view" },
              { val: "contact-edit", label: "Contact-edit" },
              { val: "contact-delete", label: "Contact-delete" },
              { val: "ticket-view", label: "Ticket-view" },
              { val: "ticket-edit", label: "Ticket-edit" },
              { val: "ticket-delete", label: "Ticket-delete" },
              { val: "todo-view", label: "Todo-View" },
              { val: "todo-edit", label: "Todo-edit" },
              { val: "todo-delete", label: "Todo-delete" },
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
