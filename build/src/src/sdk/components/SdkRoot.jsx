import React from "react";
import { Route } from "react-router-dom";
import { NAME } from "../constants";
// Components
import Publish from "./Publish";
import SdkHome from "./SdkHome";
// Modules
import status from "status";

export default class InstallerRoot extends React.Component {
  render() {
    // The second route uses regex. :id has to match ipfs/QmZ4faa..
    // so it uses the regex parameter + to any character when id's length > 0
    return (
      <div>
        <status.components.DependenciesAlert deps={["mainnet"]} />
        <Route exact path={"/" + NAME} component={SdkHome} />
        <Route path={"/" + NAME + "/publish"} component={Publish} />
      </div>
    );
  }
}
