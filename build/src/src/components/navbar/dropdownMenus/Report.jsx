import React from "react";
// Icons
import ContactSupport from "Icons/ContactSupport";
import NavLink from "react-router-dom/NavLink";
import { rootPath as reportPath } from "pages/troubleshoot";

const Report = () => {
  return (
    <NavLink className="dropdown-menu-toggle" to={reportPath}>
      <ContactSupport />
    </NavLink>
  );
};

export default Report;
