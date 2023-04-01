import React, { useContext } from "react";
import { Stack } from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";

const CustomToggle = () => {
  const [darkTheme, setDarkTheme] = useContext(ThemeContext);

  return (
    <React.Fragment>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {darkTheme ? (
          <DarkModeIcon
            onClick={() => {
              setDarkTheme(!darkTheme);
              localStorage.setItem("mockapi-theme", false);
            }}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <LightModeIcon
            onClick={() => {
              setDarkTheme(!darkTheme);
              localStorage.setItem("mockapi-theme", true);
            }}
            style={{ cursor: "pointer", color: "rgb(255,214,0)" }}
          />
        )}
      </Stack>
    </React.Fragment>
  );
};

export default CustomToggle;
