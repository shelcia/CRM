import React from "react";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";

const AuthTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color:
      theme.palette.mode === "light" ? "inherit" : "rgba(255, 255, 255, 0.6)",
  },
  "& label.Mui-focused": {
    color: "#e14eca",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#e14eca",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor:
        theme.palette.mode === "light" ? "rgba(34,42,66,.2)" : "#2b3553",
    },
    "&:hover fieldset": {
      borderColor:
        theme.palette.mode === "light" ? "rgba(34,42,66,.2)" : "#2b3553",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e14eca",
    },
  },
}));

export const CustomAuthInput = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  type = "text",
  props,
}) => {
  return (
    <AuthTextField
      fullWidth
      name={name}
      size="small"
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      helperText={touched[name] && errors[name]}
      error={Boolean(touched[name] && errors[name])}
      type={type}
      {...props}
    />
  );
};

export const CustomTextField = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  color = "primary",
  type = "text",
  props,
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
      color={color}
      type={type}
      {...props}
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

export const CustomSelectField = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  labelItms,
}) => {
  return (
    <FormControl error={Boolean(touched[name] && errors[name])}>
      <Select
        labelId={`select-${name}`}
        id={`select-${name}-id`}
        placeholder={placeholder}
        value={values[name]}
        onChange={handleChange}
        // renderValue={(value) => `⚠️  - ${value}`}
        size="small"
        name={name}
      >
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
        {labelItms.map((itm) => (
          <MenuItem value={itm.val} key={itm.val}>
            {itm.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{touched[name] && errors[name]}</FormHelperText>
    </FormControl>
  );
};
