import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const useTheme = () => {
  const [isDark, setIsDark] = useContext(ThemeContext);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("crm-theme", String(next));
  };

  return { isDark, toggle };
};

export default useTheme;
