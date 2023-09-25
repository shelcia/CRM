/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { styled } from "@mui/material/styles";

export default styled("div")(({ theme, ownerState }) => {
  const { palette, borders /*, typography*/ } = theme;
  const { darkMode } = ownerState;

  const { borderRadius } = borders;
  const { inputBorderColor, grey, white } = palette;

  return {
    "& .rdw-editor-wrapper": {
      borderRadius: borderRadius.md,
      border: `1px solid ${inputBorderColor}`,
    },

    "& .rdw-editor-toolbar": {
      border: 0,
      borderBottom: `1px solid ${inputBorderColor}`,
      borderRadius: `${borderRadius.md} ${borderRadius.md} 0 0`,
      backgroundColor: "transparent",
    },

    "& .rdw-option-wrapper, & .rdw-dropdown-wrapper": {
      borderColor: grey[200],
      backgroundColor: darkMode ? grey[500] : white,

      "&:hover": {
        boxShadow: "none",
        borderColor: grey[400],
      },
    },

    "& .rdw-option-active": {
      boxShadow: "none",
      borderColor: grey[600],
    },

    "& .public-DraftStyleDefault-block": {
      margin: 0,
      padding: "8px",
    },
  };
});
