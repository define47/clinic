import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthenticatedUserDataContextProvider } from "./contexts/UserCtx.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <AuthenticatedUserDataContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthenticatedUserDataContextProvider>
  // </React.StrictMode>,
);
