import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import { MaterialUIControllerProvider } from "./context";

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <ThemeProvider>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </ThemeProvider>
);
