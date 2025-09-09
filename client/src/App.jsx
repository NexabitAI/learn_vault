import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";

import InstructorDashboardpage from "./pages/instructor";
import AddNewCoursePage from "./pages/instructor/add-new-course";

import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";

import StudentViewCommonLayoutNew from "./components/student-view/common-layoutnew";
import StudentHomePageNew from "./pages/student/home/indexNew";
import StudentViewCoursesPageNew from "./pages/student/courses/indexNew";
import StudentViewCourseDetailsPageNew from "./pages/student/course-details/indexNew";

import NotFoundPage from "./pages/not-found";

function OutGate() {
  const { auth } = useContext(AuthContext);
  if (auth?.authenticate) {
    const role = (auth?.user?.role || "").toString().toLowerCase();
    return (
      <Navigate
        to={role === "admin" || role === "instructor" ? "/instructor" : "/home"}
        replace
      />
    );
  }
  return <Outlet />;
}

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public site for unauthenticated visitors */}
      <Route path="/out" element={<OutGate />}>
        <Route element={<StudentViewCommonLayoutNew />}>
          <Route index element={<StudentHomePageNew />} />
          <Route path="home" element={<StudentHomePageNew />} />
          <Route path="courses" element={<StudentViewCoursesPageNew />} />
          <Route path="course/details/:id" element={<StudentViewCourseDetailsPageNew />} />
        </Route>
      </Route>

      {/* Auth page (guard allows unauth, redirects authed away) */}
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Instructor (admin + instructor) */}
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Student (authenticated) */}
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route index element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />} />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="course-progress/:id" element={<StudentViewCourseProgressPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
