import React from "react";
import { Route } from "react-router-dom";
// Components
import PackagesHome from "./PackagesHome";
import PackageInterface from "./PackageInterface";
// Styles
import "./packages.scss";

const PackagesRoot = ({ match }) => (
  <>
    <Route exact path={match.path} component={PackagesHome} />
    <Route path={match.path + "/:id"} component={PackageInterface} />
  </>
);

// Use `compose` from "redux" if you need multiple HOC
export default PackagesRoot;
