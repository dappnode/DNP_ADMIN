import React from "react";
import { Route } from "react-router-dom";
import { rootPath } from "../data";
// Components
import InstallerHome from "./InstallerHome";
import InstallerSinglePkg from "./InstallerSinglePkg";
// Modules

export default class InstallerRoot extends React.Component {
  render() {
    // The second route uses regex. :id has to match ipfs/QmZ4faa..
    // so it uses the regex parameter + to any character when id's length > 0
    return (
      <div>
        <Route exact path={rootPath} component={InstallerHome} />
        <Route path={rootPath + "/:id+"} component={InstallerSinglePkg} />
      </div>
    );
  }
}
