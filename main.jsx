import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App.jsx";
import ErrorBoundary from "./src/ErrorBoundary.jsx";
import { ToastProvider } from "./src/context/ToastContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
