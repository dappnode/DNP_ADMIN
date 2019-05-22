import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import DeviceDetails from "./DeviceDetails";
import DevicesHome from "./DevicesHome";
import withLoading from "components/hoc/withLoading";
// General styles
import "./devices.css";

const DevicesRoot = () => (
  <>
    <Route exact path={rootPath} component={DevicesHome} />
    <Route path={rootPath + "/:id"} component={DeviceDetails} />
  </>
);

// Use `compose` from "redux" if you need multiple HOC
export default withLoading("devices")(DevicesRoot);
