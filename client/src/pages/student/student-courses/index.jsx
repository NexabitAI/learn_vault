// src/pages/student/student-courses/index.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";

function StudentCoursesPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const {
    studentBoughtCoursesList,
    setStudentBoughtCoursesList,
  } = useContext(StudentContext);

  const [loading, setLoading] = useState(true);

  async function fetchStudentBoughtCourses(userId) {
    try {
      setLoading(true);
      const response = await fetchStudentBoughtCoursesService(userId);
      if (response?.success) {
        setStudentBoughtCoursesList(response.data || []);
      } else {
        setStudentBoughtCoursesList([]);
      }
    } catch (err) {
      console.warn("Failed to fetch purchased courses:", err);
      setStudentBoughtCoursesList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth?.user?._id) {
      fetchStudentBoughtCourses(auth.user._id);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?._id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-8">My Courses</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {studentBoughtCoursesList.map((course) => (
            <Card
              key={course?.courseId || course?._id}
              className="flex flex-col hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title || "Course image"}
                  className="h-52 w-full object-cover rounded-md mb-4 border border-[hsl(var(--border))]"
                  loading="lazy"
                />
                <h3 className="font-bold mb-1 line-clamp-2">
                  {course?.title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="flex-1"
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId || course?._id}`)
                  }
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">No courses found</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            You haven’t purchased any courses yet.
          </p>
          <Button variant="outline" onClick={() => navigate("/courses")}>
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
}

export default StudentCoursesPage;
