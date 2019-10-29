import React from "react";
import { Switch, Route } from "react-router-dom";
import { systemPackagesSubPath } from "../data";
// Components
import PackagesHome from "./PackagesHome";
import PackageInterface from "./PackageInterface";
// Styles
import "./packages.scss";

const PackagesRoot = ({ match }) => (
  <Switch>
    <Route exact path={match.path} component={PackagesHome} />
    <Route
      path={match.path + systemPackagesSubPath}
      render={props => <PackagesHome {...props} showCoreDnps={true} />}
    />
    <Route path={match.path + "/:id"} component={PackageInterface} />
  </Switch>
);

// Use `compose` from "redux" if you need multiple HOC
export default PackagesRoot;
