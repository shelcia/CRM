import React from "react";
import { styled, TextField } from "@mui/material";

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
