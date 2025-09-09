import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

const DASHBOARD_ROLES = new Set(["instructor", "admin"]);

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const role = (user?.role || "").toString().toLowerCase();

  const onAuth = location.pathname.startsWith("/auth");
  const onInstructor = location.pathname.startsWith("/instructor");
  const onOut = location.pathname.startsWith("/out");

  // Block unauthenticated access (except /auth)
  if (!authenticated && !onAuth) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, never allow public (/out) routes
  if (authenticated && onOut) {
    return DASHBOARD_ROLES.has(role)
      ? <Navigate to="/instructor" replace />
      : <Navigate to="/home" replace />;
  }

  // Admin/Instructor: normalize them onto /instructor
  if (authenticated && DASHBOARD_ROLES.has(role)) {
    if (onAuth || !onInstructor) {
      return <Navigate to="/instructor" replace />;
    }
  }

  // Students: block /instructor and /auth once logged in
  if (authenticated && !DASHBOARD_ROLES.has(role)) {
    if (onInstructor || onAuth) {
      return <Navigate to="/home" replace />;
    }
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
