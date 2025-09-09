import { Route, Routes } from "react-router-dom";
import { useContext } from "react";

// Auth
import AuthPage from "./pages/auth";
import { AuthContext } from "./context/auth-context";
import RouteGuard from "./components/route-guard";

// Public (marketing/catalog)
import StudentViewCommonLayoutNew from "./components/student-view/common-layoutnew";
import StudentHomePageNew from "./pages/student/home/indexNew";
import StudentViewCoursesPageNew from "./pages/student/courses/indexNew";
import StudentViewCourseDetailsPageNew from "./pages/student/course-details/indexNew";

// Student protected
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";
import PaypalPaymentReturnPage from "./pages/student/payment-return";

// Instructor protected
import InstructorDashboardpage from "./pages/instructor";
import AddNewCoursePage from "./pages/instructor/add-new-course";

// Misc
import NotFoundPage from "./pages/not-found";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* -------- PUBLIC: Home / Catalog -------- */}
      <Route path="/" element={<StudentViewCommonLayoutNew />}>
        <Route index element={<StudentHomePageNew />} />
        <Route path="home" element={<StudentHomePageNew />} />
        <Route path="courses" element={<StudentViewCoursesPageNew />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetailsPageNew />} />
      </Route>

      {/* -------- AUTH page (also opened via modal from header) -------- */}
      <Route path="/auth" element={<AuthPage />} />

      {/* -------- STUDENT: Protected -------- */}
      <Route
        path="/student-courses"
        element={
          <RouteGuard
            element={<StudentCoursesPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/course-progress/:id"
        element={
          <RouteGuard
            element={<StudentViewCourseProgressPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Payment return can be public; it will finalize and then redirect */}
      <Route path="/payment-return" element={<PaypalPaymentReturnPage />} />

      {/* -------- INSTRUCTOR: Protected -------- */}
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

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
