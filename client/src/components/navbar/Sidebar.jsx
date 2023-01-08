import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../../assets/logo.png";
import { general, school } from "./links";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";
import { getCurrentSchoolInfo } from "../../api/schoolInfo";
import { getRoleText, getSemester } from "../../helpers/formatText";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const fetchCurrentSchoolInfo = async () => {
    const result = await getCurrentSchoolInfo();
    if (result.status === 2000) {
      setCurrent(result.data);
    }
  };

  const handleGoToSchoolInfo = () => {
    navigate("/school-info");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="Sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Logo" className="sidebar-brand-logo" />
        <h1 className="sidebar-brand-title">QIT</h1>
      </div>
      <nav className="sidebar-navs-box">
        <div className="sidebar-navs sidbar-navs-general">
          <span className="sidebar-navs-title">General</span>
          {general.map((g) => {
            if (g.access.includes(auth.user.role)) {
              const pathname = location.pathname;
              const cls =
                pathname === g.to
                  ? "sidebar-nav-link sidebar-nav-link-active"
                  : "sidebar-nav-link";
              return (
                <NavLink key={g.text} to={g.to} className={cls}>
                  {g.text}
                </NavLink>
              );
            }
          })}
        </div>
        <div className="sidebar-navs sidebar-navs-school">
          <span className="sidebar-navs-title">School</span>
          {school.map((g) => {
            if (g.access.includes(auth.user.role)) {
              const pathname = location.pathname;
              const cls =
                pathname === g.to
                  ? "sidebar-nav-link sidebar-nav-link-active"
                  : "sidebar-nav-link";
              return (
                <NavLink key={g.text} to={g.to} className={cls}>
                  {g.text}
                </NavLink>
              );
            }
          })}
        </div>
      </nav>
      <div className="sidebar-bottom">
        <div
          className="sidebar-current"
          onClick={(e) => {
            handleGoToSchoolInfo();
          }}
        >
          <p>
            {current
              ? current.sy + " " + getSemester(current.sem)
              : "No current SY and Semester"}
          </p>
        </div>
        <div className="sidebar-profile">
          <p>{auth ? auth.user.person.name : "No name"}</p>
          <span>{auth ? getRoleText(auth.user.role) : "No role"}</span>
          <button
            className="sidebar-function"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;