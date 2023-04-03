import React from "react";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";

export const CustomAuthInput = (props) => {
  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "#e14eca",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e14eca",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(34,42,66,.2)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(34,42,66,.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#e14eca",
      },
    },
  });
  return <CssTextField {...props} fullWidth className="mb-2" />;
};

export const CustomDarkInput = (props) => {
  const CssTextField = styled(TextField)({
    "& label": {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "0.85rem",
    },
    "& label.Mui-focused": {
      color: "#e14eca",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e14eca",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#2b3553",
      },
      "&:hover fieldset": {
        borderColor: "#2b3553",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#e14eca",
      },
    },
  });
  return <CssTextField {...props} className="mb-2" />;
};

export const CustomTextField = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
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
