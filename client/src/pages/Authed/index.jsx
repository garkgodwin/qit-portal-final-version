import React, { useState, useEffect } from "react";

//? ROUTES
import { Routes, Route } from "react-router-dom";

//? GLOBAL STATES
import { useSelector } from "react-redux";

//? PAGES
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import Staffs from "./Staffs";
import Students from "./Students";
import StudentClasses from "./StudentClasses";
import StudentGuardians from "./StudentGuardians";
import SchoolInfo from "./SchoolInfo";
import Subjects from "./Subjects";
import Classes from "./Classes";
import Schedules from "./Schedules";
import ClassInfo from "./ClassInfo";

const AuthedPages = () => {
  const [role, setRole] = useState(0);
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth !== null) {
      setRole(auth.user.role);
    } else {
      setRole(0);
    }
  }, [auth]);
  return (
    <Routes>
      <Route path="" element={<Dashboard />} />
      {role === 1 ? (
        <>
          <Route path="accounts" element={<Accounts />} />
          <Route path="staffs" element={<Staffs />} />
          <Route path="students" element={<Students />} />
          <Route
            path="students/:studentID/subjects"
            element={<StudentClasses />}
          />
          <Route
            path="students/:studentID/guardians"
            element={<StudentGuardians />}
          />
          <Route path="school-info" element={<SchoolInfo />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="classes" element={<Classes />} />
          <Route path="classes/:classID/info" element={<ClassInfo />} />
          <Route path="schedules" element={<Schedules />} />
        </>
      ) : null}
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
};

export default AuthedPages;
