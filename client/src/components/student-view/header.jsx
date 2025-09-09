// src/components/student-view/common-layout/header.jsx
import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Button } from "../ui/button"; // adjust if your button path differs
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials } = useContext(AuthContext);

  const isOnCourses = location.pathname.includes("/courses");

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <nav
      aria-label="Student navigation"
      className="
        flex items-center justify-between gap-3
        py-3
        text-[hsl(var(--foreground))]
      "
    >
      {/* Left: Brand + primary nav */}
      <div className="flex items-center gap-4">
        <Link
          to="/home"
          className="
            group flex items-center
            hover:no-underline
            text-[hsl(var(--foreground))]
          "
          aria-label="Go to Home"
        >
          <GraduationCap className="h-7 w-7 mr-3 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-extrabold md:text-xl text-sm tracking-tight">
            LEARNIFY HUB!
          </span>
        </Link>

        <div className="flex items-center">
          <Button
            variant="ghost"
            disabled={isOnCourses}
            onClick={() => {
              if (!isOnCourses) navigate("/courses");
            }}
            className="
              text-sm md:text-base font-medium
            "
          >
            Explore Courses
          </Button>
        </div>
      </div>

      {/* Right: My Courses + Sign out */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/student-courses")}
          className="
            inline-flex items-center gap-2
            font-semibold md:text-base text-sm
            hover:opacity-90
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] rounded-[var(--radius)]
          "
          aria-label="Go to My Courses"
          title="My Courses"
        >
          <span>My Courses</span>
          <TvMinimalPlay className="w-6 h-6" />
        </button>

        <Button onClick={handleLogout}>Sign Out</Button>
      </div>
    </nav>
  );
}

export default StudentViewCommonHeader;
