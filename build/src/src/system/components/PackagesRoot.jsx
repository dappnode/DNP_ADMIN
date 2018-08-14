import React from "react";
import { Route } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as action from "../actions";
import { NAME } from "../constants";
import eventBus from "eventBus";
// Components
import PackageList from "./PackageList";
import PackageInterface from "./PackageInterface";
// Modules
import status from "status";
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

class Packages extends React.Component {
  componentWillMount() {
    token = eventBus.subscribe("connection_open", this.props.fetchPackages);
    if (isOpen()) this.props.fetchPackages();
  }
  componentWillUnmount() {
    eventBus.unsubscribe(token);
  }

  render() {
    return (
      <div>
        <status.components.DependenciesAlert deps={["wamp", "dappmanager"]} />
        <Route exact path={"/" + NAME} component={PackageList} />
        <Route path={"/" + NAME + "/:id"} component={PackageInterface} />
      </div>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => {
  return {
    fetchPackages: () => {
      dispatch(action.listPackages());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Packages);
