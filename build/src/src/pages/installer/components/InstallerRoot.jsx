import React from "react";
import { Switch, Route } from "react-router-dom";
// Components
import InstallerHome from "./InstallerHome";
import InstallDnpContainer from "./InstallDnpContainer";
// Modules

const InstallerRoot = ({ match }) => (
  <Switch>
    <Route exact path={match.path} component={InstallerHome} />
    <Route path={match.path + "/:id"} component={InstallDnpContainer} />
  </Switch>
);

export default InstallerRoot;
