import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import DeviceSettings from "./DeviceSettings";
import Devices from "./Devices";

export default class DevicesRoot extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path={rootPath} component={Devices} />
        <Route path={rootPath + "/:id"} component={DeviceSettings} />
      </React.Fragment>
    );
  }
}
