// src/pages/instructor/index.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut } from "lucide-react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    try {
      const response = await fetchInstructorCourseListService();
      if (response?.success) {
        setInstructorCoursesList(response.data || []);
      } else {
        setInstructorCoursesList([]);
      }
    } catch {
      setInstructorCoursesList([]);
    }
  }

  useEffect(() => {
    fetchAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = useMemo(
    () => [
      {
        icon: BarChart,
        label: "Dashboard",
        value: "dashboard",
        component: (
          <InstructorDashboard listOfCourses={instructorCoursesList} />
        ),
      },
      {
        icon: Book,
        label: "Courses",
        value: "courses",
        component: (
          <InstructorCourses listOfCourses={instructorCoursesList} />
        ),
      },
      {
        icon: LogOut,
        label: "Logout",
        value: "logout",
        component: null,
      },
    ],
    [instructorCoursesList]
  );

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    // RouteGuard will redirect unauthenticated users away from /instructor
  }

  const activeLabel =
    menuItems.find((m) => m.value === activeTab)?.label || "Dashboard";

  return (
    <div
      className="
        min-h-screen flex
        bg-[hsl(var(--background))] text-[hsl(var(--foreground))]
      "
    >
      {/* Sidebar */}
      <aside
        className="
          hidden md:block w-64 shrink-0
          bg-[hsl(var(--card))] text-[hsl(var(--foreground))]
          border-r border-[hsl(var(--border))]
        "
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Instructor View</h2>
          <nav aria-label="Instructor navigation" className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.value;
              return (
                <Button
                  key={item.value}
                  className="w-full justify-start"
                  variant={
                    isActive ? "secondary" : "ghost"
                  }
                  onClick={
                    item.value === "logout"
                      ? handleLogout
                      : () => setActiveTab(item.value)
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-extrabold">{activeLabel}</h1>

          {/* We use Tabs just to mount/unmount content; switching is driven by sidebar Buttons */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                {item.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
