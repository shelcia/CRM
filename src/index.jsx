import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/themeContext";

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);

// "@emotion/react": "^11.10.6",
// "@emotion/styled": "^11.10.6",
// "@mui/icons-material": "^5.11.11",
// "@mui/lab": "^5.0.0-alpha.121",
// "@mui/material": "^5.11.11",
// "aos": "^2.3.4",
// "axios": "^1.3.4",
// "material-table": "^2.0.3",
// "prop-types": "^15.8.1",
// "react": "^18.2.0",
// "react-csv-importer": "^0.8.0",
// "react-dom": "^18.2.0",
// "react-feather": "^2.0.10",
// "react-hot-toast": "^2.4.0",
// "react-icons": "^4.8.0",
// "react-router-dom": "^6.8.2",
// "react-scripts": "^5.0.1",
// "suneditor": "^2.44.3",
// "suneditor-react": "^3.4.1"
