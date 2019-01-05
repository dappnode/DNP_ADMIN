import React from "react";
import { Route } from "react-router-dom";
import { NAME } from "../constants";
// Components
import DeviceSettings from "./DeviceSettings";
import Devices from "./Devices";

export default class DevicesRoot extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path={"/" + NAME} component={Devices} />
        <Route path={"/" + NAME + "/:id"} component={DeviceSettings} />
      </React.Fragment>
    );
  }
}
