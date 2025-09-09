// src/pages/instructor/parts/InstructorDashboard.jsx
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  const courses = Array.isArray(listOfCourses) ? listOfCourses : [];

  const { totalStudents, totalProfit, studentList } = useMemo(() => {
    return courses.reduce(
      (acc, course) => {
        const students = Array.isArray(course?.students) ? course.students : [];
        const studentCount = students.length;
        const price = Number(course?.pricing) || 0;

        acc.totalStudents += studentCount;
        acc.totalProfit += price * studentCount;

        for (const s of students) {
          acc.studentList.push({
            courseId: course?._id ?? "",
            courseTitle: course?.title ?? "Untitled course",
            studentName: s?.studentName ?? "Unknown",
            studentEmail: s?.studentEmail ?? "—",
          });
        }
        return acc;
      },
      { totalStudents: 0, totalProfit: 0, studentList: [] }
    );
  }, [courses]);

  const nfmt = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    []
  );

  const config = [
    { icon: Users, label: "Total Students", value: totalStudents },
    { icon: DollarSign, label: "Total Revenue", value: nfmt.format(totalProfit) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.map((item, index) => (
          <Card
            key={index}
            className="border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow)]"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[hsl(var(--border))]">
              <CardTitle className="text-sm font-medium text-[hsl(var(--foreground))]">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow)]">
        <CardHeader className="border-b border-[hsl(var(--border))]">
          <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Students List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Course Name</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentList.map((s, idx) => (
                    <TableRow key={`${s.courseId}-${s.studentEmail}-${idx}`}>
                      <TableCell className="font-medium">
                        {s.courseTitle}
                      </TableCell>
                      <TableCell>{s.studentName}</TableCell>
                      <TableCell>{s.studentEmail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div
              className="
                flex flex-col items-center justify-center gap-2 py-10
                text-[hsl(var(--muted-foreground))]
              "
            >
              <p>No enrolled students yet.</p>
              <p className="text-xs">
                Create a course and share enrollment links to see students here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
