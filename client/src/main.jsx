import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import AuthProvider from "./context/auth-context/index.jsx";
import InstructorProvider from "./context/instructor-context/index.jsx";
import StudentProvider from "./context/student-context/index.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Single source of truth for Tailwind + theme tokens
import "./assets/lms-theme.css";

// Ensure a default theme (can be 'paper' or 'soft-dark')
const savedTheme = localStorage.getItem("lms-theme");
const savedContrast = localStorage.getItem("lms-contrast");
if (!document.documentElement.getAttribute("data-theme")) {
  document.documentElement.setAttribute("data-theme", savedTheme || "paper");
}
if (savedContrast === "high") {
  document.documentElement.setAttribute("data-contrast", "high");
} else {
  document.documentElement.removeAttribute("data-contrast");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InstructorProvider>
          <StudentProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={4000}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              toastStyle={{
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow:
                  "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05)",
              }}
              bodyStyle={{ color: "hsl(var(--card-foreground))" }}
            />
          </StudentProvider>
        </InstructorProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
