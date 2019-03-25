import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import PackagesHome from "./PackagesHome";
import PackageInterface from "./PackageInterface";
// Logic

const PackagesRoot = () => (
  <React.Fragment>
    <Route exact path={rootPath} component={PackagesHome} />
    <Route path={rootPath + "/:id"} component={PackageInterface} />
  </React.Fragment>
);

export default PackagesRoot;
