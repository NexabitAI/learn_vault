import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.jpg";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePageNew() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = { category: [getCurrentId] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/out/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id);
    if (response?.success) {
      if (response?.data) navigate(`/out/course-progress/${getCurrentCourseId}`);
      else navigate(`/out/course/details/${getCurrentCourseId}`);
    }
  }

  useEffect(() => { fetchAllStudentViewCourses(); }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-12 px-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-4">Learning that gets you</h1>
          <p className="text-lg text-muted-foreground max-w-prose">
            Skills for your present and your future. Get started with us.
          </p>
        </div>
        <div className="w-full">
          <img src={banner} className="w-full h-auto rounded-xl glass" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem?._id}
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border rounded-xl overflow-hidden shadow glass cursor-pointer"
              >
                <img src={courseItem?.image} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold mb-1">{courseItem?.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold">${courseItem?.pricing}</p>
                </div>
              </div>
            ))
          ) : (
            <h3>No Courses Found</h3>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePageNew;
