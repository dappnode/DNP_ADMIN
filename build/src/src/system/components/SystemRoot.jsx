import React from "react";
import { Route } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as action from "../actions";
import { NAME } from "../constants";
// Components
import SystemList from "./SystemList";
import SystemInterface from "./SystemInterface";
// Modules
import status from "status";
// Logic

class System extends React.Component {
  render() {
    return (
      <div>
        <status.components.DependenciesAlert deps={["wamp", "dappmanager"]} />
        <Route exact path={"/" + NAME} component={SystemList} />
        <Route path={"/" + NAME + "/:id"} component={SystemInterface} />
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
)(System);
