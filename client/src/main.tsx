import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthenticatedUserDataContextProvider } from "./contexts/UserContext.tsx";
import { ThemeContextProvider } from "./contexts/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthenticatedUserDataContextProvider>
    <ThemeContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContextProvider>
  </AuthenticatedUserDataContextProvider>
);
