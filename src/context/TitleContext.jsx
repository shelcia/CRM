import React from "react";
import { createContext, useState } from "react";

export const TitleContext = createContext({
  title: "",
  setTitle: (arg) => {},
}); // props types for provider

const TitleContextProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  return (
    <TitleContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};

export default TitleContextProvider;
