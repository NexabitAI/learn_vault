import { Navigate, useLocation, Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  const PROTECTED_PREFIXES = ["/student-courses", "/course-progress", "/instructor"];
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    location.pathname.startsWith(p)
  );

  if (isProtected && !authenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (
    location.pathname.startsWith("/instructor") &&
    authenticated &&
    user?.role !== "instructor"
  ) {
    return <Navigate to="/home" replace />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
