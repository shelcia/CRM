import React, { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

const CustomToggle = () => {
  const [darkTheme, setDarkTheme] = useContext(ThemeContext);

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      onClick={() => {
        setDarkTheme(!darkTheme);
        localStorage.setItem("mockapi-theme", String(!darkTheme));
      }}
      aria-label="toggle theme"
    >
      {darkTheme ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-400" />
      )}
    </Button>
  );
};

export default CustomToggle;
