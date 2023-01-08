import React, { useState, useEffect } from "react";
import "./Pages.css";
import { useSelector } from "react-redux";
import GuestPages from "./Guest";
import AuthedPages from "./Authed";
import { useLocation } from "react-router-dom";

const Pages = () => {
  const [pageCls, setPageCls] = useState("Page");
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth.user === null) {
      if (location.pathname === "/login") {
        setPageCls("Page page-login");
      } else {
        setPageCls("Page");
      }
    } else {
      setPageCls("Page page-authed");
    }
  }, [location]);

  useEffect(() => {
    if (auth.user === null) {
      if (location.pathname === "/login") {
        setPageCls("Page page-login");
      } else {
        setPageCls("Page");
      }
    } else {
      setPageCls("Page page-authed");
    }
  }, [auth]);
  return (
    <div className={pageCls}>
      {auth.user === null ? <GuestPages /> : <AuthedPages />}
    </div>
  );
};

export default Pages;
