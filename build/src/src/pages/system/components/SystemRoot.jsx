import React from "react";
import { Route, Switch } from "react-router-dom";
import { title, rootPath, updatePath, addIpfsPeerPath } from "../data";
// Components
import SystemHome from "./SystemHome";
import SystemUpdate from "./SystemUpdate";
import AddIpfsPeer from "./AddIpfsPeer";
import packages from "pages/packages";
// Styles
import "./system.scss";

const PackageInterface = packages.components.PackageInterface;

const SystemRoot = () => (
  <>
    {/* Use switch so only the first match is rendered. match.url = /system */}
    <Switch>
      <Route exact path={rootPath} component={SystemHome} />
      <Route path={rootPath + "/" + updatePath} component={SystemUpdate} />
      <Route
        path={rootPath + "/" + addIpfsPeerPath + "/:peer"}
        component={AddIpfsPeer}
      />
      <Route
        path={rootPath + "/:id"}
        render={props => <PackageInterface {...props} moduleName={title} />}
      />
    </Switch>
  </>
);

// Container

// Use `compose` from "redux" if you need multiple HOC
export default SystemRoot;
