import React from "react";
import { NavLink } from "react-router-dom";

const NavbarLink = ({ text, to, cls }) => {
  return (
    <NavLink to={to} className={"nav-link" + (cls ? " " + cls : "")}>
      {text}
    </NavLink>
  );
};

export default NavbarLink;
