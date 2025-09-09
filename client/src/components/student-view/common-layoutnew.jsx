// src/components/student-view/common-layoutnew/index.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeaderNew from "./headerNew";

function StudentViewCommonLayoutNew() {
  const location = useLocation();
  const showHeader = !location.pathname.includes("course-progress");

  return (
    <div
      className="
        min-h-screen
        bg-[hsl(var(--background))]
        text-[hsl(var(--foreground))]
      "
    >
      {/* Skip link for accessibility */}
      <a
        href="#content"
        className="
          sr-only focus:not-sr-only
          fixed left-4 top-4 z-50
          px-3 py-2 rounded-[var(--radius)]
          bg-[hsl(var(--card))] text-[hsl(var(--foreground))]
          border border-[hsl(var(--border))]
          shadow-[var(--shadow)]
        "
      >
        Skip to content
      </a>

      {showHeader ? (
        <header className="sticky top-0 z-40 bg-[hsl(var(--card))]/90 backdrop-blur border-b border-[hsl(var(--border))]">
          <div className="container">
            <StudentViewCommonHeaderNew />
          </div>
        </header>
      ) : null}

      <main id="content" role="main" className="container py-4 md:py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentViewCommonLayoutNew;
