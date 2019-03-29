import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import PackagesHome from "./PackagesHome";
import PackageInterface from "./PackageInterface";
import withLoading from "components/hoc/withLoading";
// Logic

const PackagesRoot = () => (
  <React.Fragment>
    <Route exact path={rootPath} component={PackagesHome} />
    <Route path={rootPath + "/:id"} component={PackageInterface} />
  </React.Fragment>
);

// Use `compose` from "redux" if you need multiple HOC
export default withLoading("dnpInstalled", "installed DNPs")(PackagesRoot);
