import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data || []);
    else setInstructorCoursesList([]);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    { icon: BarChart, label: "Dashboard", value: "dashboard" },
    { icon: Book, label: "Courses", value: "courses" },
    { icon: LogOut, label: "Logout", value: "logout" },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    window.location.replace("/auth");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r shadow-sm hidden md:block">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-card-foreground">Instructor View</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.value}
                className="w-full justify-start"
                variant={activeTab === item.value ? "secondary" : "ghost"}
                onClick={item.value === "logout" ? handleLogout : () => setActiveTab(item.value)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-background">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            {activeTab === "dashboard" ? "Dashboard" : activeTab === "courses" ? "Courses" : ""}
          </h1>

          {activeTab === "dashboard" && (
            <InstructorDashboard listOfCourses={instructorCoursesList || []} />
          )}

          {activeTab === "courses" && (
            <InstructorCourses listOfCourses={instructorCoursesList || []} />
          )}
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
