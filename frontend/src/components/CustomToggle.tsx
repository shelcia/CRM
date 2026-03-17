import React, { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";

const CustomToggle = () => {
  const [darkTheme, setDarkTheme] = useContext(ThemeContext);

  return (
    <button
      onClick={() => {
        setDarkTheme(!darkTheme);
        localStorage.setItem("mockapi-theme", String(!darkTheme));
      }}
      className="flex items-center justify-center cursor-pointer"
      aria-label="toggle theme"
    >
      {darkTheme ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </button>
  );
};

export default CustomToggle;
