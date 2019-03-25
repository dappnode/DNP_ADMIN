import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import Publish from "./Publish";
import Explore from "./Explore";
import SdkHome from "./SdkHome";

import "./sdk.css";

export default class InstallerRoot extends React.Component {
  render() {
    return (
      <div>
        <Route exact path={rootPath} component={SdkHome} />
        <Route path={rootPath + "/publish/:urlQuery?"} component={Publish} />
        <Route path={rootPath + "/explore"} component={Explore} />
      </div>
    );
  }
}
