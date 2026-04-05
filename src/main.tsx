import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";

// Validate required environment variables at startup
const REQUIRED_ENV: (keyof ImportMetaEnv)[] = ["VITE_BACK_URL"];
const missing = REQUIRED_ENV.filter((key) => !import.meta.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}\n` +
    `Copy .env.example to .env and fill in the values.`
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
