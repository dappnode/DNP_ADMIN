import React from "react";
import { Route, Switch } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { NAME, UPDATE } from "../constants";
// Components
import SystemHome from "./SystemHome";
import SystemUpdate from "./SystemUpdate";
import packages from "packages";
// Modules
import status from "status";

const PackageInterface = packages.components.PackageInterface;

const SystemRoot = ({ match }) => (
  <div>
    <status.components.DependenciesAlert deps={["wamp", "dappmanager"]} />
    {/* Use switch so only the first match is rendered. match.url = /system */}
    <Switch>
      <Route exact path={match.url} component={SystemHome} />
      <Route path={`${match.url}/${UPDATE}`} component={SystemUpdate} />
      <Route
        path={`${match.url}/:id`}
        render={props => <PackageInterface {...props} moduleName={NAME} />}
      />
    </Switch>
  </div>
);

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemRoot);
