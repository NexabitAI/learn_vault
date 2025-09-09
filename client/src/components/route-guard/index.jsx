// src/components/route-guard/index.jsx
import React, { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const path = location.pathname || "/";

  const isAuthPath = path.startsWith("/auth");
  const isInstructorPath = path.startsWith("/instructor");
  const isInstructor = user?.role === "instructor";

  // Not logged in → force Auth, preserve where they were headed
  if (!authenticated && !isAuthPath) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Logged in as non-instructor → block /instructor and /auth
  if (authenticated && !isInstructor && (isInstructorPath || isAuthPath)) {
    const to = "/home";
    if (path !== to) return <Navigate to={to} replace />;
  }

  // Logged in as instructor → keep them under /instructor
  if (authenticated && isInstructor && !isInstructorPath) {
    const to = "/instructor";
    if (path !== to) return <Navigate to={to} replace />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
