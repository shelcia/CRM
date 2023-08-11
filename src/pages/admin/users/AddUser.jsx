import React, { useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  CustomMultipleCheckBoxField,
  CustomSelectField,
  CustomTextField,
} from "../../../components/CustomInputs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiUsers } from "../../../services/models/usersModel";
import toast from "react-hot-toast";

const AddUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string("Should be string").required("Name is required !"),
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
    role: "non-admin",
    permissions: ["users-view"],
    password: "",
  };
  const { errors, values, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      inviteUser(values);
    },
  });

  const inviteUser = (values) => {
    // console.log(values);
    apiUsers.post({ ...values, company: "nasdaq" }, "", true).then((res) => {
      if (res.status === "200") {
        toast.success("User has been invited");
        setIsLoading(false);
      } else {
        // console.log(res);
        toast.error(res.message);
        setIsLoading(false);
      }
    });
  };

  const [checkedUsers, setCheckedUsers] = useState([true, true, true]);
  const [checkedContacts, setCheckedContacts] = useState([true, true, true]);
  const [checkedTickets, setCheckedTickets] = useState([true, true, true]);
  const [checkedTodos, setCheckedTodos] = useState([true, true, true]);

  return (
    <Box component="section">
      <Container>
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Add User
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                // marginTop: 5,
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
                  { val: "non-admin", label: "Non Admin" },
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
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                // marginTop: 5,
              }}
            >
              <Typography component={"p"} variant={"h6"}>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3} sm={4} md={3}>
                  <CustomMultipleCheckBoxField
                    label="User"
                    labelItms={["Users View", "Users Edit", "Users Delete"]}
                    checked={checkedUsers}
                    setChecked={setCheckedUsers}
                  />
                </Grid>
                <Grid item xs={3} sm={4} md={3}>
                  <CustomMultipleCheckBoxField
                    label="Contacts"
                    labelItms={[
                      "Contacts View",
                      "Contacts Edit",
                      "Contacts Delete",
                    ]}
                    checked={checkedContacts}
                    setChecked={setCheckedContacts}
                  />
                </Grid>
                <Grid item xs={3} sm={4} md={3}>
                  <CustomMultipleCheckBoxField
                    label="Tickets"
                    labelItms={[
                      "Tickets View",
                      "Tickets Edit",
                      "Tickets Delete",
                    ]}
                    checked={checkedTickets}
                    setChecked={setCheckedTickets}
                  />
                </Grid>
                <Grid item xs={3} sm={4} md={3}>
                  <CustomMultipleCheckBoxField
                    label="Todos"
                    labelItms={["Todos View", "Todos Edit", "Todos Delete"]}
                    checked={checkedTodos}
                    setChecked={setCheckedTodos}
                  />
                </Grid>
              </Grid>
              <LoadingButton
                loading={isLoading}
                loadingIndicator="Loading…"
                variant="contained"
                onClick={handleSubmit}
              >
                Invite User
              </LoadingButton>
              {/* <Button onClick={handleSubmit} variant="contained">
                Invite User
              </Button> */}
            </Box>
          </Grid>
        </Grid>

        {/* <CustomSelectChipField
            label="Permissions"
            name="permissions"
            placeholder="permissions"
            labelItms={[
              { val: "users-view", label: "Users view" },
              { val: "users-edit", label: "Users Edit" },
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
          /> */}
      </Container>
    </Box>
  );
};

export default AddUser;
