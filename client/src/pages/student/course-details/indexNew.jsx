// src/pages/student/course-details/indexNew.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";

function StudentViewCourseDetailsPageNew() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  // we only need navigate for "Sign in to buy"
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  async function fetchStudentViewCourseDetails() {
    setLoadingState(true);
    try {
      const response = await fetchStudentViewCourseDetailsService(
        currentCourseDetailsId
      );
      if (response?.success) {
        setStudentViewCourseDetails(response.data);
      } else {
        setStudentViewCourseDetails(null);
      }
    } finally {
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(item) {
    setDisplayCurrentVideoFreePreview(item?.videoUrl || null);
  }

  // open preview dialog when url is set
  useEffect(() => {
    if (displayCurrentVideoFreePreview) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  // fetch when id available
  useEffect(() => {
    if (currentCourseDetailsId) fetchStudentViewCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCourseDetailsId]);

  // set id from route
  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // cleanup when leaving details route
  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const freePreviewIndex = useMemo(() => {
    if (!studentViewCourseDetails?.curriculum?.length) return -1;
    return studentViewCourseDetails.curriculum.findIndex((i) => i.freePreview);
  }, [studentViewCourseDetails]);

  if (loadingState) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_500px] gap-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
          <div>
            <Skeleton className="h-[280px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!studentViewCourseDetails) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Course not found</CardTitle>
          </CardHeader>
          <CardContent>
            This course may have been removed or is unavailable.
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    title,
    subtitle,
    instructorName,
    date,
    primaryLanguage,
    students = [],
    pricing,
    objectives = "",
    description = "",
    curriculum = [],
  } = studentViewCourseDetails;

  const initialPreviewUrl =
    freePreviewIndex !== -1 ? curriculum[freePreviewIndex]?.videoUrl : "";

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{title}</h1>
        <p className="text-base md:text-lg text-[hsl(var(--muted-foreground))] mb-4">
          {subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[hsl(var(--muted-foreground))]">
          <span>Created by {instructorName}</span>
          <span>Created on {formatDate(date)}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {primaryLanguage}
          </span>
          <span>
            {students.length} {students.length === 1 ? "Student" : "Students"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Main */}
        <main className="flex-grow">
          {/* Learn */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What you’ll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(objectives ? objectives.split(",") : []).map((objective, index) => (
                  <li key={`${objective}-${index}`} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-[hsl(var(--chart-2))] flex-shrink-0" />
                    <span>{objective.trim()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-[hsl(var(--foreground))]">
              {description}
            </CardContent>
          </Card>

          {/* Curriculum */}
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {curriculum.map((item, index) => {
                  const clickable = Boolean(item?.freePreview);
                  return (
                    <li
                      key={item?.public_id || `${item?.title}-${index}`}
                      className={[
                        "flex items-center",
                        clickable ? "cursor-pointer" : "cursor-not-allowed opacity-80",
                      ].join(" ")}
                      onClick={clickable ? () => handleSetFreePreview(item) : undefined}
                    >
                      {clickable ? (
                        <PlayCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <Lock className="mr-2 h-4 w-4" />
                      )}
                      <span>{item?.title}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </main>

        {/* Aside */}
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <div className="aspect-video rounded-[var(--radius)] overflow-hidden border border-[hsl(var(--border))]">
                <VideoPlayer url={initialPreviewUrl} width="100%" height="200px" />
              </div>

              <div className="mb-2">
                <span className="text-3xl font-bold">${Number(pricing || 0)}</span>
              </div>

              <Button onClick={() => navigate("/auth")} className="w-full">
                Sign In to Buy
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Free preview dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowFreePreviewDialog(false);
            setDisplayCurrentVideoFreePreview(null);
          }
        }}
      >
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>

          <div className="aspect-video rounded-[var(--radius)] overflow-hidden border border-[hsl(var(--border))]">
            <VideoPlayer url={displayCurrentVideoFreePreview || ""} width="100%" height="200px" />
          </div>

          <div className="flex flex-col gap-2">
            {curriculum
              .filter((i) => i.freePreview)
              .map((i, idx) => (
                <button
                  key={i?.public_id || `${i?.title}-${idx}`}
                  onClick={() => handleSetFreePreview(i)}
                  className="text-left cursor-pointer text-[16px] font-medium hover:underline"
                >
                  {i?.title}
                </button>
              ))}
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPageNew;
