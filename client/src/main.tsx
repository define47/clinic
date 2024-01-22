import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthenticatedUserDataContextProvider } from "./contexts/UserContext.tsx";
import { ThemeContextProvider } from "./contexts/ThemeContext.tsx";
import { SocketNotificationDataContextProvider } from "./contexts/SocketNotificationContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthenticatedUserDataContextProvider>
    <SocketNotificationDataContextProvider>
      <ThemeContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContextProvider>
    </SocketNotificationDataContextProvider>
  </AuthenticatedUserDataContextProvider>
);
