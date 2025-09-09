// src/context/student-context/index.jsx
import React, { createContext, useMemo, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({});

  // Helper: reset the currently viewed course details/progress
  const resetCurrentCourseView = () => {
    setStudentViewCourseDetails(null);
    setCurrentCourseDetailsId(null);
    setStudentCurrentCourseProgress({});
  };

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      studentViewCoursesList,
      setStudentViewCoursesList,
      loadingState,
      setLoadingState,
      studentViewCourseDetails,
      setStudentViewCourseDetails,
      currentCourseDetailsId,
      setCurrentCourseDetailsId,
      studentBoughtCoursesList,
      setStudentBoughtCoursesList,
      studentCurrentCourseProgress,
      setStudentCurrentCourseProgress,
      resetCurrentCourseView,
    }),
    [
      studentViewCoursesList,
      loadingState,
      studentViewCourseDetails,
      currentCourseDetailsId,
      studentBoughtCoursesList,
      studentCurrentCourseProgress,
    ]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}
