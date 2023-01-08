import React from "react";
import Home from "./Home";
import Login from "./Login";
import FirstSetup from "./FirstSetup";
import { Routes, Route } from "react-router-dom";
import "./Guest.css";

const GuestPages = () => {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="first-setup/:userID" element={<FirstSetup />} />
      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  );
};

export default GuestPages;
