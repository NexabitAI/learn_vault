// src/pages/student/course-progress/index.jsx
import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Confetti from "react-confetti";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { auth } = useContext(AuthContext);
  const {
    studentCurrentCourseProgress,
    setStudentCurrentCourseProgress,
  } = useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const curriculum = studentCurrentCourseProgress?.courseDetails?.curriculum || [];
  const progress = studentCurrentCourseProgress?.progress || [];

  const currentLectureIndex = useMemo(() => {
    if (!currentLecture || !curriculum.length) return -1;
    return curriculum.findIndex((l) => l._id === currentLecture._id);
  }, [currentLecture, curriculum]);

  const selectLecture = useCallback(
    (lectureObj) => {
      if (!lectureObj) return;
      setCurrentLecture(lectureObj);
    },
    [setCurrentLecture]
  );

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
        return;
      }

      setStudentCurrentCourseProgress({
        courseDetails: response?.data?.courseDetails,
        progress: response?.data?.progress,
      });

      // Completed flag from backend
      if (response?.data?.completed) {
        selectLecture(response?.data?.courseDetails?.curriculum?.[0]);
        setShowCourseCompleteDialog(true);
        setShowConfetti(true);
        return;
      }

      // Pick next unviewed lecture
      if ((response?.data?.progress || []).length === 0) {
        selectLecture(response?.data?.courseDetails?.curriculum?.[0]);
      } else {
        const lastViewedIndex = response?.data?.progress.reduceRight(
          (acc, obj, index) => (acc === -1 && obj.viewed ? index : acc),
          -1
        );
        const next = response?.data?.courseDetails?.curriculum?.[lastViewedIndex + 1];
        if (next) {
          selectLecture(next);
        } else {
          // all viewed -> completed
          selectLecture(response?.data?.courseDetails?.curriculum?.[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (!currentLecture) return;
    const response = await markLectureAsViewedService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id,
      currentLecture._id
    );
    if (response?.success) {
      await fetchCurrentCourseProgress();
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );
    if (response?.success) {
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      setCurrentLecture(null);
      await fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // When a lecture hits 100% (VideoPlayer sets progressValue=1)
  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLecture?.progressValue]);

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 15000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  const isViewed = (lectureId) =>
    progress.find((p) => p.lectureId === lectureId)?.viewed;

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {showConfetti && <Confetti />}

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to My Courses
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSideBarOpen((s) => !s)}
          aria-label={isSideBarOpen ? "Hide sidebar" : "Show sidebar"}
          title={isSideBarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSideBarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Player + title */}
        <div className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}>
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl || ""}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title || "—"}</h2>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={[
            "fixed top-[64px] right-0 bottom-0 w-[400px]",
            "bg-[hsl(var(--card))] border-l border-[hsl(var(--border))]",
            "transition-transform duration-300",
            isSideBarOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 p-0 h-14 rounded-none">
              <TabsTrigger value="content" className="rounded-none h-full">
                Course Content
              </TabsTrigger>
              <TabsTrigger value="overview" className="rounded-none h-full">
                Overview
              </TabsTrigger>
            </TabsList>

            {/* Content */}
            <TabsContent value="content" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {curriculum.map((item) => {
                    const active = item._id === currentLecture?._id;
                    const viewed = isViewed(item._id);
                    return (
                      <button
                        key={item._id}
                        onClick={() => selectLecture(item)}
                        className={[
                          "w-full text-left px-2 py-2 rounded-md border",
                          "transition-colors",
                          active
                            ? "bg-[hsl(var(--accent))] border-[hsl(var(--border))]"
                            : "bg-transparent border-transparent hover:bg-[hsl(var(--accent))]",
                          "flex items-center gap-2 text-sm font-medium",
                        ].join(" ")}
                        aria-current={active ? "true" : "false"}
                      >
                        {viewed ? (
                          <Check className="h-4 w-4 text-[hsl(var(--chart-2))]" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="line-clamp-2">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Overview */}
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Purchase gate */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => navigate(`/course/details/${id}`)}>Go to course page</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion dialog */}
      <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course.</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>My Courses</Button>
                <Button variant="outline" onClick={handleRewatchCourse}>
                  Rewatch Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
