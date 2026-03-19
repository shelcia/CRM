import { useState, createContext, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

type ThemeContextType = [boolean, Dispatch<SetStateAction<boolean>>];

export const ThemeContext = createContext<ThemeContextType>([false, () => {}]);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("mockapi-theme") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={[isDark, setIsDark]}>
      {children}
    </ThemeContext.Provider>
  );
};
