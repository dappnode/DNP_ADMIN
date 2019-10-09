import React from "react";
import { NavLink } from "react-router-dom";
import { title, rootPath, systemPackagesSubPath } from "../data";
import withTitle from "components/hoc/withTitle";
// Components
import PackageList from "./PackageList";

const PackagesHome = ({ showCoreDnps }) => {
  const options = [
    { name: "My packages", path: rootPath },
    { name: "System packages", path: rootPath + systemPackagesSubPath }
  ];

  return (
    <>
      <div className="horizontal-navbar">
        {options.map(option => (
          <button key={option.path} className="item-container">
            <NavLink
              to={option.path}
              exact
              className="item no-a-style"
              style={{ whiteSpace: "nowrap" }}
            >
              {option.name}
            </NavLink>
          </button>
        ))}
      </div>

      <PackageList moduleName={title} coreDnps={showCoreDnps} />
    </>
  );
};

export default withTitle(title)(PackagesHome);
