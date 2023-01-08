import React from "react";

import logo from "../../assets/logo.png";
import "./Navbar.css";
import NavbarLink from "./NavbarLink";

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-brand-logo" />
        <h1 className="navbar-brand-title">QIT</h1>
      </div>
      <nav className="navbar-navs">
        <NavbarLink to={"/"} text={"Home"} cls={""} />
        <NavbarLink to={"/login"} text={"Login"} cls={"nav-link-emphasize"} />
      </nav>
    </div>
  );
};

export default Navbar;
