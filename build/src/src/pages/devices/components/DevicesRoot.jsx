import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import DeviceSettings from "./DeviceSettings";
import DevicesHome from "./DevicesHome";
import withLoading from "components/hoc/withLoading";

const DevicesRoot = () => (
  <>
    <Route exact path={rootPath} component={DevicesHome} />
    <Route path={rootPath + "/:id"} component={DeviceSettings} />
  </>
);

// Use `compose` from "redux" if you need multiple HOC
export default withLoading("devices")(DevicesRoot);
