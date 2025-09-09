import { Navigate, useLocation, Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  // Define what actually requires auth
  const PROTECTED_PREFIXES = ["/student-courses", "/course-progress", "/instructor"];
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    location.pathname.startsWith(p)
  );

  // 1) If route needs auth and user is not authenticated → go to /auth
  if (isProtected && !authenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 2) If user is not an instructor but tries instructor pages → kick to home
  if (
    location.pathname.startsWith("/instructor") &&
    authenticated &&
    user?.role !== "instructor"
  ) {
    return <Navigate to="/home" replace />;
  }

  // 3) Do NOT force instructors away from public pages.
  //    (Remove your old "if instructor then redirect to /instructor" block.)

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
