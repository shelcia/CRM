import { TextField } from "@mui/material";
import React from "react";

export const CustomTextField = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
}) => {
  return (
    <TextField
      fullWidth
      name={name}
      size="small"
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      helperText={touched[name] && errors[name]}
      error={Boolean(touched[name] && errors[name])}
    />
  );
};

export const CustomTextAreaField = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  rows = 5,
}) => {
  return (
    <TextField
      fullWidth
      rows={rows}
      multiline
      name={name}
      size="small"
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      helperText={touched[name] && errors[name]}
      error={Boolean(touched[name] && errors[name])}
    />
  );
};
