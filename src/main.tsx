import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";

// Configurar manejo global de errores no capturados
const setupGlobalErrorHandling = () => {
  // Capturar promesas rechazadas no manejadas
  window.addEventListener("unhandledrejection", (event) => {
    console.error("🚨 [UNHANDLED PROMISE REJECTION]", {
      reason: event.reason,
      promise: event.promise,
    });

    // Prevenir que el error aparezca en la consola por defecto
    event.preventDefault();
  });

  // Capturar errores de JavaScript no manejados
  window.addEventListener("error", (event) => {
    console.error("🚨 [UNHANDLED ERROR]", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });

    // Prevenir que el error aparezca en la consola por defecto
    event.preventDefault();
  });
};

// Configurar el manejo de errores antes de renderizar la app
setupGlobalErrorHandling();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
