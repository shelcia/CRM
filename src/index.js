import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import TitleContextProvider from "./context/TitleContext";

ReactDOM.render(
  <TitleContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TitleContextProvider>,
  document.getElementById("root")
);
