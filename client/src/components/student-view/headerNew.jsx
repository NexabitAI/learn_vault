// src/components/student-view/headerNew.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "../ui/button";

function StudentViewCommonHeaderNew() {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnCourses = location.pathname.startsWith("/out/courses");

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <nav
      aria-label="Public navigation"
      className="flex items-center justify-between gap-3 py-3 text-[hsl(var(--foreground))]"
    >
      {/* Left: Brand + primary nav */}
      <div className="flex items-center gap-4">
        <Link
          to="/out"
          className="group flex items-center hover:no-underline text-[hsl(var(--foreground))]"
          aria-label="Go to Home"
        >
          <GraduationCap className="h-7 w-7 mr-3 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-extrabold md:text-xl text-sm tracking-tight">
            LEARNIFY HUB!
          </span>
        </Link>

        <Button
          variant="ghost"
          disabled={isOnCourses}
          onClick={() => {
            if (!isOnCourses) navigate("/out/courses");
          }}
          className="text-sm md:text-base font-medium"
        >
          Explore Courses
        </Button>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSignIn}>Sign In</Button>
      </div>
    </nav>
  );
}

export default StudentViewCommonHeaderNew;
