import React from "react";
import { Link } from "react-router-dom";
// Components
import { ButtonLight } from "components/Button";
// Modules
import { rootPath as installerRootPath } from "pages/installer";
// Utils
import { shortNameCapitalized } from "utils/format";

const NoPackagesYet = ({
  id,
  moduleName
}: {
  id: string;
  moduleName: string;
}) => (
  <div className="centered-container">
    <h4>{id} is not installed</h4>
    <p>Go back to {moduleName} or click below to install it</p>
    <Link style={{ margin: "0 10px" }} to={"/" + moduleName}>
      <ButtonLight style={{ textTransform: "capitalize" }}>
        {moduleName}
      </ButtonLight>
    </Link>
    <Link style={{ margin: "0 10px" }} to={installerRootPath + "/" + id}>
      <ButtonLight>Install {shortNameCapitalized(id)}</ButtonLight>
    </Link>
  </div>
);

export default NoPackagesYet;
