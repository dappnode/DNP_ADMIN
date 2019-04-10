import React from "react";
import { Link } from "react-router-dom";
import { rootPath as installerRootPath } from "pages/installer";
// Components
import { ButtonLight } from "components/Button";

const NoPackagesYet = () => (
  <div className="centered-container">
    <h4>No installed DNPs yet</h4>
    <p>
      If you would like install a DAppNode package (DNP), go to the installer
      tab.
    </p>
    <Link to={installerRootPath}>
      <ButtonLight>Go to Install</ButtonLight>
    </Link>
  </div>
);

export default NoPackagesYet;
