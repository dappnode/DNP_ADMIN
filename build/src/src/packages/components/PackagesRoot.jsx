import React from "react";
import { Route } from "react-router-dom";
import { NAME } from "../constants";
// Components
import PackagesHome from "./PackagesHome";
import PackageInterface from "./PackageInterface";
// Modules
import status from "status";
// Logic

const PackagesRoot = () => (
  <React.Fragment>
    <status.components.DependenciesAlert deps={["wamp", "dappmanager"]} />
    <Route exact path={`/${NAME}`} component={PackagesHome} />
    <Route path={`/${NAME}/:id`} component={PackageInterface} />
  </React.Fragment>
);

export default PackagesRoot;
