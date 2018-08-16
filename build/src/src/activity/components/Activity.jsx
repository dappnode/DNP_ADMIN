import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as selectors from "../selectors";
import ActivityList from "./ActivityList";

import status from "status";
import chains from "chains";

import "./activity.css";

class ActivityView extends React.Component {
  render() {
    // userActionLogs

    return (
      <div>
        <h1>Activity</h1>
        <p>
          If a developer asks for more information regarding an error; please
          find the error in the list below, tap on it and copy everything in the
          expanded grey text area.
        </p>
        <ActivityList userActionLogs={this.props.userActionLogs} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  status: status.selectors.getAll,
  chains: chains.selectors.getAll,
  userActionLogs: selectors.getUserActionLogs
});

const mapDispatchToProps = dispatch => {
  return {
    // init: () => {
    //   dispatch(action.init());
    // }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityView);
