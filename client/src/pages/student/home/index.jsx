// src/pages/student/home/index.jsx
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { courseCategories } from "@/config";
import { StudentContext } from "@/context/student-context";
import { AuthContext } from "@/context/auth-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";

// If the image is placed in /public, prefer using the absolute path:
const bannerSrc = "/banner-img.jpg";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(categoryId) {
    sessionStorage.removeItem("filters");
    const currentFilter = { category: [categoryId] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data || []);
  }

  async function handleCourseNavigate(courseId) {
    // If not authenticated yet, take them to details to sign in/purchase from there
    if (!auth?.authenticate) {
      navigate(`/course/details/${courseId}`);
      return;
    }

    const response = await checkCoursePurchaseInfoService(courseId, auth?.user?._id);
    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${courseId}`);
      } else {
        navigate(`/course/details/${courseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Hero */}
      <section className="container mx-auto py-8 px-4 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
        <div className="lg:pr-8">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            Learning that gets you
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))]">
            Skills for your present and your future. Get started with us.
          </p>
        </div>
        <div className="w-full">
          <img
            src={bannerSrc}
            width={600}
            height={400}
            alt="Learning banner"
            className="w-full h-auto rounded-lg border border-[hsl(var(--border))] shadow"
            loading="eager"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-[hsl(var(--muted))]">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {courseCategories.map((category) => (
              <Button
                key={category.id}
                className="justify-start"
                variant="outline"
                onClick={() => handleNavigateToCoursesPage(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>

          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {studentViewCoursesList.map((course) => (
                <Card
                  key={course?._id}
                  className="cursor-pointer hover:bg-[hsl(var(--accent))] transition-colors"
                  onClick={() => handleCourseNavigate(course?._id)}
                >
                  <CardContent className="p-0">
                    <div className="w-full h-40 overflow-hidden rounded-t-lg border-b border-[hsl(var(--border))]">
                      <img
                        src={course?.image}
                        alt={course?.title || "Course image"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <CardTitle className="text-base mb-2 line-clamp-2">
                        {course?.title}
                      </CardTitle>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                        {course?.instructorName}
                      </p>
                      <p className="font-bold text-[16px]">${Number(course?.pricing || 0)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <h3 className="text-lg text-[hsl(var(--muted-foreground))]">
              No courses found.
            </h3>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
