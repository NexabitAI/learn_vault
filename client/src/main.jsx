// src/main.jsx (or src/index.tsx)
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import AuthProvider from "./context/auth-context/index.jsx";
import InstructorProvider from "./context/instructor-context/index.jsx";
import StudentProvider from "./context/student-context/index.jsx";

import { ToastContainer } from "react-toastify";
import "./assets/lms-theme.css";              // ← global theme tokens
import { ThemeProvider } from "./theme/ThemeProvider.jsx"; // ← wrapper you added earlier

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
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
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                  borderRadius: "12px",
                }}
                bodyStyle={{ color: "var(--text)" }}
              />
            </StudentProvider>
          </InstructorProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
