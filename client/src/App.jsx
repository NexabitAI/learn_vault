// src/App.jsx
import React, { useContext, useEffect, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
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
import { useTheme } from "./theme/ThemeProvider.jsx";

/* --- Themed fallback while routes/components render --- */
function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        color: "var(--text)",
        padding: 24,
      }}
    >
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          Loading…
        </div>
        <div style={{ opacity: 0.75 }}>Preparing your LMS workspace</div>
      </div>
    </div>
  );
}

/* --- Scroll to top on route change (nice with multi-page LMS) --- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Smooth on large pages, instant on short ones
    const behavior = document.body.scrollHeight > 1400 ? "smooth" : "auto";
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname]);
  return null;
}

function App() {
  const { auth } = useContext(AuthContext);
  const { toggleTheme, toggleContrast } = useTheme();

  // Optional power-user shortcuts:
  // D => toggle Paper/Soft-Dark, H => toggle High-Contrast
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target.isContentEditable) {
        return; // don't hijack typing
      }
      if (e.key.toLowerCase() === "d") toggleTheme();
      if (e.key.toLowerCase() === "h") toggleContrast();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTheme, toggleContrast]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* ------------------ New Student Layout ------------------ */}
          <Route path="/out" element={<StudentViewCommonLayoutNew />}>
            <Route index element={<StudentHomePageNew />} />
            <Route path="home" element={<StudentHomePageNew />} />
            <Route path="courses" element={<StudentViewCoursesPageNew />} />
            <Route path="course/details/:id" element={<StudentViewCourseDetailsPageNew />} />
          </Route>

          {/* ------------------ Auth ------------------ */}
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

          {/* ------------------ Instructor ------------------ */}
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

          {/* ------------------ Old Student Layout ------------------ */}
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

          {/* ------------------ Catch All ------------------ */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
