import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SECTION_KEYS = /** @type const */ (["curriculum", "landing", "settings"]);

export default function AddNewCoursePage() {
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

  const [activeSection, setActiveSection] = useState("curriculum");
  const isEditing = useMemo(() => !!currentEditedCourseId, [currentEditedCourseId]);

  // ---------- utils ----------
  const isEmpty = (v) =>
    Array.isArray(v) ? v.length === 0 : v === "" || v == null;

  function validateFormData() {
    // landing form must be fully filled
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }
    // curriculum must have at least one lecture with video+title and at least one free preview
    if (!Array.isArray(courseCurriculumFormData) || courseCurriculumFormData.length === 0) {
      return false;
    }
    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (isEmpty(item?.title) || isEmpty(item?.videoUrl) || isEmpty(item?.public_id)) {
        return false;
      }
      if (item?.freePreview) hasFreePreview = true;
    }
    return hasFreePreview;
  }

  // ---------- actions ----------
  async function handleCreateOrUpdate() {
    const payload = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    const resp = isEditing
      ? await updateCourseByIdService(currentEditedCourseId, payload)
      : await addNewCourseService(payload);

    if (resp?.success) {
      // reset form
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCurrentEditedCourseId(null);
      navigate("/instructor");
    }
  }

  async function handleDelete() {
    if (!params?.courseId) return;
    const ok = window.confirm("Are you sure you want to delete this course?");
    if (!ok) return;
    const resp = await deleteCourseService(params.courseId);
    if (resp?.success) {
      setCurrentEditedCourseId(null);
      navigate("/instructor", { replace: true });
    }
  }

  // ---------- effects ----------
  async function fetchCurrentCourseDetails() {
    const resp = await fetchInstructorCourseDetailsService(currentEditedCourseId);
    if (resp?.success) {
      // map only known keys from initial landing shape
      const mapped = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
        acc[key] = resp?.data?.[key] ?? courseLandingInitialFormData[key];
        return acc;
      }, {});
      setCourseLandingFormData(mapped);
      setCourseCurriculumFormData(Array.isArray(resp?.data?.curriculum) ? resp.data.curriculum : []);
    } else {
      // fallback to clean state
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
    }
  }

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params.courseId);
    else setCurrentEditedCourseId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.courseId]);

  useEffect(() => {
    if (currentEditedCourseId) fetchCurrentCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditedCourseId]);

  // ---------- render ----------
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {isEditing ? "Edit course" : "Create a new course"}
          </h1>
          <div className="flex gap-3">
            {isEditing && (
              <Button
                variant="outline"
                className="px-6"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <Button
              disabled={!validateFormData()}
              className="px-8"
              onClick={handleCreateOrUpdate}
            >
              {isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </div>

        {/* Segmented control (replacing Tabs) */}
        <div className="mt-6 inline-flex rounded-lg border bg-card text-card-foreground p-1">
          {SECTION_KEYS.map((key) => (
            <Button
              key={key}
              variant={activeSection === key ? "secondary" : "ghost"}
              className="capitalize"
              onClick={() => setActiveSection(key)}
            >
              {key === "landing" ? "Course Landing Page" : key}
            </Button>
          ))}
        </div>

        <Card className="mt-4 bg-card text-card-foreground">
          <CardContent className="p-4 md:p-6">
            {activeSection === "curriculum" && <CourseCurriculum />}
            {activeSection === "landing" && <CourseLanding />}
            {activeSection === "settings" && <CourseSettings />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
