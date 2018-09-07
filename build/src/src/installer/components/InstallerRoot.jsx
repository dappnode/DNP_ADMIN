import React from "react";
import { Route } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as actions from "../actions";
import { NAME } from "../constants";
import eventBus from "eventBus";
// Components
import Installer from "../containers/Installer";
import InstallerSinglePkg from "./InstallerSinglePkg";
// Modules
import status from "status";
import packages from "packages";
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

class Packages extends React.Component {
  componentWillMount() {
    token = eventBus.subscribe("connection_open", this.props.fetchDirectory);
    if (isOpen()) this.props.fetchDirectory();
  }
  componentWillUnmount() {
    eventBus.unsubscribe(token);
  }

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

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => {
  return {
    fetchDirectory: () => {
      dispatch(actions.fetchDirectory());
      dispatch(packages.actions.listPackages());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Packages);
