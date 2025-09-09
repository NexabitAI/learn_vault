// src/pages/instructor/add-new-course/index.jsx
import { useContext, useEffect, useState } from "react";
import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  deleteCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function isEmpty(value) {
    if (Array.isArray(value)) return value.length === 0;
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    // All landing fields must be present
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }

    // Curriculum: every item complete, at least one free preview
    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) hasFreePreview = true;
    }
    return hasFreePreview;
  }

  async function handleCreateCourse() {
    if (!validateFormData()) return;
    setSubmitting(true);

    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      // Preserve original key used by your backend
      isPublised: true,
    };

    try {
      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
          : await addNewCourseService(courseFinalFormData);

      if (response?.success) {
        toast.success(
          currentEditedCourseId ? "Course updated successfully." : "Course created successfully."
        );
        // Reset local form state
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        setCurrentEditedCourseId(null);
        navigate(-1);
      } else {
        toast.error(response?.message || "Unable to save course.");
      }
    } catch (e) {
      toast.error(e?.message || "An error occurred while saving the course.");
    } finally {
      setSubmitting(false);
    }
  }

  async function fetchCurrentCourseDetails() {
    try {
      const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);
      if (response?.success) {
        const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
          acc[key] = response?.data[key] ?? courseLandingInitialFormData[key];
          return acc;
        }, {});
        setCourseLandingFormData(setCourseFormData);
        setCourseCurriculumFormData(response?.data?.curriculum || []);
      }
    } catch {
      toast.error("Failed to fetch course details.");
    }
  }

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params.courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.courseId]);

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditedCourseId]);

  async function handleDeleteCourse(courseId) {
    if (!courseId) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await deleteCourseService(courseId);
      if (res?.success) {
        toast.success("Course deleted.");
        // Clean up local state
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        setCurrentEditedCourseId(null);
        navigate("/instructor", { replace: true });
      } else {
        toast.error(res?.message || "Failed to delete course.");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred while deleting the course.");
    } finally {
      setDeleting(false);
    }
  }

  const isEditing = Boolean(currentEditedCourseId);
  const canSubmit = validateFormData() && !submitting;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-[hsl(var(--border))]">
          <CardTitle className="text-2xl font-extrabold">
            {isEditing ? "Edit Course" : "Create a new course"}
          </CardTitle>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Button
                variant="destructive"
                className="text-sm tracking-wider font-semibold px-5"
                onClick={() => handleDeleteCourse(currentEditedCourseId || params.courseId)}
                disabled={deleting}
                title="Delete this course"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            ) : null}
            <Button
              disabled={!canSubmit}
              className="text-sm tracking-wider font-semibold px-6"
              onClick={handleCreateCourse}
              title={canSubmit ? "Submit course" : "Complete all required fields first"}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="p-2 md:p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>

              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>

              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
