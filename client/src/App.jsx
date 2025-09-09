import { Route, Routes } from "react-router-dom";

// Auth
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";

// Instructor
import InstructorDashboardpage from "./pages/instructor";
import AddNewCoursePage from "./pages/instructor/add-new-course";

// Student – NEW public layout
import StudentViewCommonLayoutNew from "./components/student-view/common-layoutnew";
import StudentHomePageNew from "./pages/student/home/indexNew";
import StudentViewCoursesPageNew from "./pages/student/courses/indexNew";
import StudentViewCourseDetailsPageNew from "./pages/student/course-details/indexNew";

// Student – protected areas
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";

// Misc
import NotFoundPage from "./pages/not-found";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* ---------- PUBLIC: Marketing / Catalog ---------- */}
      <Route path="/" element={<StudentViewCommonLayoutNew />}>
        <Route index element={<StudentHomePageNew />} />
        <Route path="home" element={<StudentHomePageNew />} />
        <Route path="courses" element={<StudentViewCoursesPageNew />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetailsPageNew />} />
      </Route>

      {/* ---------- AUTH (accessed explicitly or via modal) ---------- */}
      <Route path="/auth" element={<AuthPage />} />

      {/* ---------- STUDENT: Protected areas ---------- */}
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
      <Route path="/payment-return" element={<PaypalPaymentReturnPage />} />

      {/* ---------- INSTRUCTOR: Protected ---------- */}
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

      {/* ---------- Catch All ---------- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
