import React from "react";
import { Route } from "react-router-dom";
import { NAME } from "../constants";
// Components
import PackagesHome from "./PackagesHome";
import PackageInterface from "./PackageInterface";
// Modules
import status from "status";
// Logic

export default class PackagesRoot extends React.Component {
  render() {
    return (
      <div>
        <status.components.DependenciesAlert deps={["wamp", "dappmanager"]} />
        <Route exact path={"/" + NAME} component={PackagesHome} />
        <Route path={"/" + NAME + "/:id"} component={PackageInterface} />
      </div>
    );
  }
}
