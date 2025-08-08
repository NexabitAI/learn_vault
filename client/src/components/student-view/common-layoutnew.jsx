import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import StudentViewCommonHeaderNew from "./headerNew";

function StudentViewCommonLayoutNew() {
  const location = useLocation();
  return (
    <div>
      {!location.pathname.includes("course-progress") ? (
        <StudentViewCommonHeaderNew />
      ) : null}

      <Outlet />
    </div>
  );
}

export default StudentViewCommonLayoutNew;
