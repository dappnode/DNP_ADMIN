import React from "react";
import { Route } from "react-router-dom";
import { NAME } from "../constants";
// Components
import Installer from "./Installer";
import InstallerSinglePkg from "./InstallerSinglePkg";
// Modules
import status from "status";

export default class InstallerRoot extends React.Component {
  render() {
    // The second route uses regex. :id has to match ipfs/QmZ4faa..
    // so it uses the regex parameter + to any character when id's length > 0
    return (
      <div>
        <status.components.DependenciesAlert
          deps={["wamp", "dappmanager", "ipfs", "mainnet", "upnp"]}
        />
        <Route exact path={"/" + NAME} component={Installer} />
        <Route path={"/" + NAME + "/:id+"} component={InstallerSinglePkg} />
      </div>
    );
  }
}
