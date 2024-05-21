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

import React, { forwardRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { MenuItem, Link } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";

// eslint-disable-next-line react/display-name
const NotificationItem = forwardRef(({ icon, title, ...rest }, ref) => (
  <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
    <MDBox
      component={Link}
      py={0.5}
      display="flex"
      alignItems="center"
      lineHeight={1}
    >
      <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
        {icon}
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" sx={{ ml: 1 }}>
        {title}
      </MDTypography>
    </MDBox>
  </MenuItem>
));

// Typechecking props for the NotificationItem
NotificationItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default NotificationItem;

function menuItem(theme) {
  const { palette, borders, transitions } = theme;

  const { secondary, light, dark } = palette;
  const { borderRadius } = borders;

  return {
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: secondary.main,
    borderRadius: borderRadius.md,
    transition: transitions.create("background-color", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    "& *": {
      transition: "color 100ms linear",
    },

    "&:not(:last-child)": {
      mb: 1,
    },

    "&:hover": {
      backgroundColor: light.main,

      "& *": {
        color: dark.main,
      },
    },
  };
}
