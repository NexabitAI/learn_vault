import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

const DASHBOARD_ROLES = new Set(["instructor", "admin"]);

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const role = (user?.role || "").toString().toLowerCase();
  const onAuthPage = location.pathname.startsWith("/auth");
  const onInstructor = location.pathname.startsWith("/instructor");

  // Not logged in => force to /auth (student public pages live under /out and aren't wrapped by this guard)
  if (!authenticated && !onAuthPage) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in and role is dashboard-eligible (instructor/admin)
  if (authenticated && DASHBOARD_ROLES.has(role)) {
    // If they’re on /auth or any non-instructor route wrapped by this guard, send them to dashboard
    if (onAuthPage || !onInstructor) {
      return <Navigate to="/instructor" replace />;
    }
  }

  // Logged in but NOT dashboard-eligible (student, etc.)
  if (authenticated && !DASHBOARD_ROLES.has(role)) {
    // Block access to instructor or lingering /auth
    if (onInstructor || onAuthPage) {
      return <Navigate to="/home" replace />;
    }
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
