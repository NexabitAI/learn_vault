// src/pages/instructor/parts/InstructorCourses.jsx
import React, { useContext, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  const hasCourses = Array.isArray(listOfCourses) && listOfCourses.length > 0;

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    []
  );

  const handleCreate = () => {
    setCurrentEditedCourseId(null);
    setCourseLandingFormData(courseLandingInitialFormData);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
    navigate("/instructor/create-new-course");
  };

  return (
    <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow)]">
      <CardHeader className="flex justify-between flex-row items-center gap-3 border-b border-[hsl(var(--border))]">
        <CardTitle className="text-2xl md:text-3xl font-extrabold text-[hsl(var(--foreground))]">
          All Courses
        </CardTitle>
        <Button onClick={handleCreate} className="px-6 py-5">
          Create New Course
        </Button>
      </CardHeader>

      <CardContent>
        {hasCourses ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfCourses.map((course, idx) => {
                  const title = course?.title ?? "Untitled course";
                  const studentsCount = Array.isArray(course?.students)
                    ? course.students.length
                    : 0;
                  const price = Number(course?.pricing) || 0;
                  const revenue = studentsCount * price;

                  return (
                    <TableRow key={course?._id ?? `course-${idx}`}>
                      <TableCell className="font-medium">{title}</TableCell>
                      <TableCell>{studentsCount}</TableCell>
                      <TableCell>{currency.format(revenue)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() =>
                            navigate(`/instructor/edit-course/${course?._id}`)
                          }
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit ${title}`}
                          title="Edit course"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        {/* Delete action can be added here when backend is ready */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div
            className="
              flex flex-col items-center justify-center gap-3
              text-center py-12
              border border-dashed border-[hsl(var(--border))]
              rounded-[var(--radius)]
              bg-[hsl(var(--card))]
            "
          >
            <p className="text-[hsl(var(--muted-foreground))]">
              You haven’t created any courses yet.
            </p>
            <Button onClick={handleCreate}>Create your first course</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
