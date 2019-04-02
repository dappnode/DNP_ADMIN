import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import DeviceSettings from "./DeviceSettings";
import Devices from "./Devices";
import withLoading from "components/hoc/withLoading";

const DevicesRoot = () => (
  <React.Fragment>
    <Route exact path={rootPath} component={Devices} />
    <Route path={rootPath + "/:id"} component={DeviceSettings} />
  </React.Fragment>
);

// Use `compose` from "redux" if you need multiple HOC
export default withLoading("devices")(DevicesRoot);
