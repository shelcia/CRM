import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import {
  CustomSelectField,
  CustomTextField,
} from "../../../components/CustomInputs";

const AddContact = ({ open, setOpen }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Contact name is Required!"),
    email: Yup.string().email("Enter valid email!"),
    number: Yup.string(),
    company: Yup.string(),
    contactOwner: Yup.string(),
    // assignee: Yup.array(),
    priority: Yup.string(),
    companySize: Yup.number().min(0, "company size cannot be lesser than 1"),
    jobTitle: Yup.string(),
    expectedRevenue: Yup.number(),
    // expectedClosing: Yup.number(),
    probability: Yup.number().min(0).max(1),
    status: Yup.string().required("enter valid status"),
    lastActivity: Yup.string(),
  });

  const initialValues = {
    name: "",
    email: "",
    number: "",
    company: "",
    contactOwner: "",
    priority: "low",
    companySize: 50,
    jobTitle: "",
    expectedRevenue: 10000,
    probability: 0.5,
    status: "new",
    lastActivity: Date.now(),
  };
  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    touched /*setFieldValue*/,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const onClose = () => setOpen(false);

  return (
    <CustomModal open={open} onClose={onClose} title="Add Contact">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        <CustomTextField
          name="name"
          placeholder="name"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
        <CustomTextField
          name="email"
          placeholder="enter email ex: romeo@gmail.com"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
        <CustomTextField
          name="number"
          placeholder="number"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
          type="number"
        />
        <CustomTextField
          name="company"
          placeholder="company"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
        <CustomSelectField
          name="priority"
          placeholder="priority"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
          labelItms={[
            { val: "low", label: "Low" },
            { val: "medium", label: "Medium" },
            { val: "high", label: "High" },
            { val: "veryHigh", label: "Very High" },
          ]}
        />
        <CustomTextField
          name="companySize"
          placeholder="companySize"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
        <CustomTextField
          name="jobTitle"
          placeholder="jobTitle"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
        <CustomTextField
          name="probability"
          placeholder="probability"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
        <CustomSelectField
          name="status"
          placeholder="status"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
          labelItms={[
            { val: "new", label: "New" },
            { val: "open", label: "Open" },
            { val: "inProgress", label: "In Progress" },
            { val: "openDeal", label: "Open Deal" },
            { val: "unqualified", label: "Unqualified" },
            { val: "badTiming", label: "Bad Timing" },
            { val: "attempted", label: "Attempted to Connect" },
            { val: "connected", label: "Connected" },
            { val: "closed", label: "Closed" },
          ]}
        />
        <Box align="end" mt={1}>
          <Button variant="contained" onClick={handleSubmit} type="submit">
            Add
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default AddContact;
