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

// Material Dashboard 2 PRO React Base Styles
import colors from "../../base/colors";
import typography from "../../base/typography";

// Material Dashboard 2 PRO React Helper Functions
import pxToRem from "../../functions/pxToRem";

const { text, info, secondary, transparent } = colors;
const { size } = typography;

const buttonText = {
  base: {
    backgroundColor: transparent.main,
    minHeight: pxToRem(37),
    color: text.main,
    boxShadow: "none",
    padding: `${pxToRem(9)} ${pxToRem(24)}`,

    "&:hover": {
      backgroundColor: transparent.main,
      boxShadow: "none",
    },

    "&:focus": {
      boxShadow: "none",
    },

    "&:active, &:active:focus, &:active:hover": {
      opacity: 0.85,
      boxShadow: "none",
    },

    "&:disabled": {
      boxShadow: "none",
    },

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(16)} !important`,
    },
  },

  small: {
    minHeight: pxToRem(29),
    padding: `${pxToRem(6)} ${pxToRem(18)}`,
    fontSize: size.xs,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(12)} !important`,
    },
  },

  large: {
    minHeight: pxToRem(44),
    padding: `${pxToRem(12)} ${pxToRem(64)}`,
    fontSize: size.sm,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(22)} !important`,
    },
  },

  primary: {
    color: info.main,

    "&:hover": {
      color: info.main,
    },

    "&:focus:not(:hover)": {
      color: info.focus,
      boxShadow: "none",
    },
  },

  secondary: {
    color: secondary.main,

    "&:hover": {
      color: secondary.main,
    },

    "&:focus:not(:hover)": {
      color: secondary.focus,
      boxShadow: "none",
    },
  },
};

export default buttonText;
