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
import React from "react";
import { useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-router components
import { Link } from "react-router-dom";

// @mui material components
import Collapse from "@mui/material/Collapse";
import MuiLink from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 PRO React TS exampless
import DefaultNavbarDropdown from "./DefaultNavbarDropdown";

function DefaultNavbarMobile({ routes, open }) {
  const [collapse, setCollapse] = useState("");

  const handleSetCollapse = (name) =>
    collapse === name ? setCollapse(false) : setCollapse(name);

  const renderNavbarItems = routes.map(
    ({
      name,
      icon,
      collapse: routeCollapses,
      href,
      route,
      collapse: navCollapse,
    }) => (
      <DefaultNavbarDropdown
        key={name}
        name={name}
        icon={icon}
        collapseStatus={name === collapse}
        onClick={() => handleSetCollapse(name)}
        href={href}
        route={route}
        collapse={Boolean(navCollapse)}
      >
        <MDBox
          sx={{ height: "15rem", maxHeight: "15rem", overflowY: "scroll" }}
        >
          {routeCollapses &&
            routeCollapses.map((item) => (
              <MDBox key={item.name} px={2}>
                {item.collapse ? (
                  <>
                    <MDBox
                      width="100%"
                      display="flex"
                      alignItems="center"
                      p={1}
                    >
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="1.5rem"
                        height="1.5rem"
                        borderRadius="md"
                        color="text"
                        mr={1}
                        fontSize="1rem"
                        lineHeight={1}
                      >
                        {typeof item.icon === "string" ? (
                          <Icon>{item.icon}</Icon>
                        ) : (
                          item.icon
                        )}
                      </MDBox>
                      <MDTypography
                        display="block"
                        variant="button"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {item.name}
                      </MDTypography>
                    </MDBox>
                    {item.collapse.map((el, index) => (
                      <MDTypography
                        key={el.name}
                        component={el.route ? Link : MuiLink}
                        to={el.route ? el.route : ""}
                        href={el.href ? el.href : ""}
                        target={el.href ? "_blank" : ""}
                        rel={el.href ? "noreferrer" : "noreferrer"}
                        minWidth="11.25rem"
                        display="block"
                        variant="button"
                        color="text"
                        textTransform="capitalize"
                        fontWeight="regular"
                        py={0.625}
                        px={5}
                        mb={index === item.collapse.length - 1 ? 2 : 0}
                        sx={({
                          palette: { grey, dark },
                          borders: { borderRadius },
                        }) => ({
                          borderRadius: borderRadius.md,
                          cursor: "pointer",
                          transition: "all 300ms linear",

                          "&:hover": {
                            backgroundColor: grey[200],
                            color: dark.main,
                          },
                        })}
                      >
                        {el.name}
                      </MDTypography>
                    ))}
                  </>
                ) : (
                  <MDBox
                    key={item.key}
                    display="flex"
                    component={item.route ? Link : MuiLink}
                    to={item.route ? item.route : ""}
                    href={item.href ? item.href : ""}
                    target={item.href ? "_blank" : ""}
                    rel={item.href ? "noreferrer" : "noreferrer"}
                    sx={({
                      palette: { grey, dark },
                      borders: { borderRadius },
                    }) => ({
                      borderRadius: borderRadius.md,
                      cursor: "pointer",
                      transition: "all 300ms linear",
                      py: 1,
                      px: 1.625,

                      "&:hover": {
                        backgroundColor: grey[200],
                        color: dark.main,

                        "& *": {
                          color: dark.main,
                        },
                      },
                    })}
                  >
                    <MDBox
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="1.5rem"
                      height="1.5rem"
                      borderRadius="md"
                      color="text"
                      mr={1}
                      fontSize="1rem"
                      lineHeight={1}
                    >
                      {typeof item.icon === "string" ? (
                        <Icon>{item.icon}</Icon>
                      ) : (
                        item.icon
                      )}
                    </MDBox>
                    <MDBox>
                      <MDTypography
                        display="block"
                        variant="button"
                        fontWeight={!item.description ? "regular" : "bold"}
                        mt={!item.description ? 0.25 : 0}
                        textTransform="capitalize"
                      >
                        {item.name || "&nbsp"}
                      </MDTypography>
                      {item.description && (
                        <MDTypography
                          display="block"
                          variant="button"
                          color="text"
                          fontWeight="regular"
                          sx={{ transition: "all 300ms linear" }}
                        >
                          {item.description}
                        </MDTypography>
                      )}
                    </MDBox>
                  </MDBox>
                )}
              </MDBox>
            ))}
        </MDBox>
      </DefaultNavbarDropdown>
    )
  );

  return (
    <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
      <MDBox width="calc(100% + 1.625rem)" my={2} ml={-2}>
        {renderNavbarItems}
      </MDBox>
    </Collapse>
  );
}

// Typechecking props for the DefaultNavbarMobile
DefaultNavbarMobile.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
