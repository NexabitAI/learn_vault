import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

const DASHBOARD_ROLES = new Set(["instructor", "admin"]);

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const role = (user?.role || "").toString().toLowerCase();

  const onAuth = location.pathname.startsWith("/auth");
  const onInstructor = location.pathname.startsWith("/instructor");
  const onOut = location.pathname.startsWith("/out");

  // ───────── Unauthenticated: allow /out and /auth; send everything else to /out
  if (!authenticated) {
    if (onOut || onAuth) return <Fragment>{element}</Fragment>;
    return <Navigate to="/out" replace />;
  }

  // ───────── Authenticated: never allow /out/*
  if (onOut) {
    return DASHBOARD_ROLES.has(role)
      ? <Navigate to="/instructor" replace />
      : <Navigate to="/home" replace />;
  }

  // Instructors/Admins live under /instructor
  if (DASHBOARD_ROLES.has(role)) {
    if (onAuth) return <Navigate to="/instructor" replace />;
    if (!onInstructor) return <Navigate to="/instructor" replace />;
    return <Fragment>{element}</Fragment>;
  }

  // Students: block /instructor and /auth once logged in
  if (onInstructor || onAuth) return <Navigate to="/home" replace />;

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
