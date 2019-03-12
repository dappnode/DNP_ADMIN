import React from "react";
import { Route } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Components
import SystemHome from "./SystemHome";
import packages from "packages";
// Modules
import status from "status";

const PackageInterface = packages.components.PackageInterface;

class System extends React.Component {
  render() {
    return (
      <div>
        <status.components.DependenciesAlert deps={["wamp", "dappmanager"]} />
        <Route exact path={"/" + NAME} component={SystemHome} />
        <Route
          path={"/" + NAME + "/:id"}
          render={props => <PackageInterface {...props} moduleName={NAME} />}
        />
      </div>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(System);
