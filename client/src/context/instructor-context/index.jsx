// src/context/instructor-context/index.jsx
import React, { createContext, useMemo, useState } from "react";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  // Handy helper to reset both forms back to their initial states
  const resetCourseForms = () => {
    setCourseLandingFormData(courseLandingInitialFormData);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
  };

  // Memoize context value to avoid unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      courseLandingFormData,
      setCourseLandingFormData,
      courseCurriculumFormData,
      setCourseCurriculumFormData,
      mediaUploadProgress,
      setMediaUploadProgress,
      mediaUploadProgressPercentage,
      setMediaUploadProgressPercentage,
      instructorCoursesList,
      setInstructorCoursesList,
      currentEditedCourseId,
      setCurrentEditedCourseId,
      resetCourseForms,
    }),
    [
      courseLandingFormData,
      courseCurriculumFormData,
      mediaUploadProgress,
      mediaUploadProgressPercentage,
      instructorCoursesList,
      currentEditedCourseId,
    ]
  );

  return (
    <InstructorContext.Provider value={value}>
      {children}
    </InstructorContext.Provider>
  );
}
