import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
// The console still requires an Internet Explorer compatibility shim.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
