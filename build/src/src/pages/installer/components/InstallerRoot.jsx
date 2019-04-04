import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import InstallerHome from "./InstallerHome";
import InstallerSinglePkg from "./InstallerSinglePkg";
// Modules

const InstallerRoot = () => (
  <>
    <Route exact path={rootPath} component={InstallerHome} />
    {/* Using :id+ so it matches only id.length > 0 */}
    <Route path={rootPath + "/:id+"} component={InstallerSinglePkg} />
  </>
);

export default InstallerRoot;
