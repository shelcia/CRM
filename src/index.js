import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createRoot } from "react-dom/client";
// import TitleContextProvider from "./context/TitleContext";

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  // <TitleContextProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </TitleContextProvider>,
);
