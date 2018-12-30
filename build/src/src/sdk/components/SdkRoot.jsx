import React from "react";
import { Route } from "react-router-dom";
import { NAME } from "../constants";
// Components
import Publish from "./Publish";
import Explore from "./Explore";
import SdkHome from "./SdkHome";
// Modules
import status from "status";
import "./sdk.css";

export default class InstallerRoot extends React.Component {
  render() {
    return (
      <div>
        <status.components.DependenciesAlert deps={["mainnet"]} />
        <Route exact path={"/" + NAME} component={SdkHome} />
        <Route path={"/" + NAME + "/publish/:urlQuery?"} component={Publish} />
        <Route path={"/" + NAME + "/explore"} component={Explore} />
      </div>
    );
  }
}
