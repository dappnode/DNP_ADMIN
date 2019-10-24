import React from "react";
import { Switch, Route } from "react-router-dom";
// Components
import InstallerHome from "./InstallerHome";
import InstallerContainer from "./InstallerContainer";
import InstallerSinglePkg from "./InstallerSinglePkg";
// Modules

const InstallerRoot = ({ match }) => (
  <Switch>
    <Route exact path={match.path} component={InstallerHome} />
    <Route path={match.path + "/old/:id"} component={InstallerSinglePkg} />
    <Route path={match.path + "/:id"} component={InstallerContainer} />
  </Switch>
);

export default InstallerRoot;
