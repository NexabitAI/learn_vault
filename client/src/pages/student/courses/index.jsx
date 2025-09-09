// src/pages/student/courses/index.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";

/** Build a plain object of query params where each filter array is joined by commas */
function buildQueryObject(filters, sort) {
  const query = {};
  Object.entries(filters || {}).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length) {
      query[key] = arr.join(",");
    }
  });
  if (sort) query.sortBy = sort;
  return query;
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleFilterOnChange(sectionId, option) {
    const next = { ...filters };
    const current = new Set(next[sectionId] || []);
    if (current.has(option.id)) {
      current.delete(option.id);
    } else {
      current.add(option.id);
    }
    next[sectionId] = Array.from(current);
    // Clean up empty arrays to avoid noisy query params
    if (next[sectionId].length === 0) delete next[sectionId];

    setFilters(next);
    sessionStorage.setItem("filters", JSON.stringify(next));
  }

  async function fetchAllStudentViewCourses(activeFilters, activeSort) {
    setLoadingState(true);
    try {
      const query = new URLSearchParams(buildQueryObject(activeFilters, activeSort));
      const response = await fetchStudentViewCourseListService(query);
      if (response?.success) {
        setStudentViewCoursesList(response.data || []);
      } else {
        setStudentViewCoursesList([]);
      }
    } finally {
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(courseId) {
    // If not authenticated, send to details (purchase flow handled there)
    if (!auth?.authenticate) {
      navigate(`/course/details/${courseId}`);
      return;
    }

    const response = await checkCoursePurchaseInfoService(courseId, auth?.user?._id);
    if (response?.success) {
      if (response.data) {
        navigate(`/course-progress/${courseId}`);
      } else {
        navigate(`/course/details/${courseId}`);
      }
    }
  }

  // initialize filters from session, and default sort
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  // keep URL query in sync with UI state
  useEffect(() => {
    const q = buildQueryObject(filters, sort);
    setSearchParams(new URLSearchParams(q));
  }, [filters, sort, setSearchParams]);

  // fetch whenever filters or sort change
  useEffect(() => {
    fetchAllStudentViewCourses(filters, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  // clean session on unmount
  useEffect(() => {
    return () => sessionStorage.removeItem("filters");
  }, []);

  const resultsCount = studentViewCoursesList?.length || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-4">All Courses</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters */}
        <aside className="w-full md:w-64 space-y-4">
          <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            {Object.keys(filterOptions).map((sectionKey, idx) => (
              <div
                key={sectionKey}
                className={[
                  "p-4",
                  idx !== Object.keys(filterOptions).length - 1 ? "border-b border-[hsl(var(--border))]" : "",
                ].join(" ")}
              >
                <h3 className="font-bold mb-3 tracking-wide">
                  {sectionKey.toUpperCase()}
                </h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[sectionKey].map((option) => {
                    const checked =
                      !!filters?.[sectionKey]?.length &&
                      filters[sectionKey].includes(option.id);

                    return (
                      <Label
                        key={`${sectionKey}-${option.id}`}
                        className="flex items-center gap-3 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => handleFilterOnChange(sectionKey, option)}
                        />
                        <span className="select-none">{option.label}</span>
                      </Label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((opt) => (
                    <DropdownMenuRadioItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-sm font-bold">
              {loadingState ? "…" : resultsCount} Results
            </span>
          </div>

          {/* List */}
          <div className="space-y-4">
            {loadingState ? (
              <>
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </>
            ) : resultsCount > 0 ? (
              studentViewCoursesList.map((course) => (
                <Card
                  key={course?._id}
                  onClick={() => handleCourseNavigate(course?._id)}
                  className="cursor-pointer course-card hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-md border border-[hsl(var(--border))]">
                      <img
                        src={course?.image}
                        alt={course?.title || "Course image"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-1 line-clamp-2">
                        {course?.title}
                      </CardTitle>

                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                        Created by{" "}
                        <span className="font-semibold text-[hsl(var(--foreground))]">
                          {course?.instructorName}
                        </span>
                      </p>

                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 mb-2">
                        {`${course?.curriculum?.length || 0} ${
                          (course?.curriculum?.length || 0) <= 1 ? "Lecture" : "Lectures"
                        } • ${(course?.level || "").toString().toUpperCase()} Level`}
                      </p>

                      <p className="font-bold text-lg">${Number(course?.pricing || 0)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h2 className="font-extrabold text-2xl md:text-3xl text-center py-10">
                No Courses Found
              </h2>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
