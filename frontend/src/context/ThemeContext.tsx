import { useState, createContext, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

type ThemeContextType = [boolean, Dispatch<SetStateAction<boolean>>];

export const ThemeContext = createContext<ThemeContextType>([false, () => {}]);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkTheme, setDarkTheme] = useState(false);

  const darkThemeLocal = localStorage.getItem("mockapi-theme");

  useEffect(() => {
    if (darkThemeLocal === "true") {
      setDarkTheme(true);
    }
  }, [darkThemeLocal]);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  return (
    <ThemeContext.Provider value={[darkTheme, setDarkTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
