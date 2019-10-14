import React from "react";
import { Route } from "react-router-dom";
// Components
import InstallerHome from "./InstallerHome";
import Installer from "./Installer";
// Modules

const InstallerRoot = ({ match }) => (
  <>
    <Route exact path={match.path} component={InstallerHome} />
    {/* Using :id+ so it matches only id.length > 0 */}
    <Route path={match.path + "/:id"} component={Installer} />
  </>
);

export default InstallerRoot;
