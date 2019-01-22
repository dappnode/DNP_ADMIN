import React from "react";
import { Route } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Components
import TroubleshootHome from "./TroubleshootHome";
// Modules
import status from "status";
// Logic

class Packages extends React.Component {
  render() {
    return (
      <div>
        <status.components.DependenciesAlert deps={["wamp", "dappmanager"]} />
        <Route exact path={"/" + NAME} component={TroubleshootHome} />
        <Route path={"/" + NAME + "/:id"} component={null} />
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
)(Packages);
