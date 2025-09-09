import { GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeaderNew() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center hover:opacity-90">
            <GraduationCap className="h-7 w-7 mr-3 text-emerald-400" />
            <span className="font-extrabold text-lg tracking-tight">
              LEARNIFY HUB
            </span>
          </Link>

          <Button
            variant="ghost"
            className="hidden sm:inline-flex"
            onClick={() => navigate("/out/courses")}
          >
            Explore Courses
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {auth?.authenticate ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/student-courses")}
              >
                My Courses
              </Button>
              <Button
                onClick={() => {
                  resetCredentials();
                  sessionStorage.clear();
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeaderNew;
