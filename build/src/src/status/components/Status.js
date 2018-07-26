import React from "react";
import { connect } from "react-redux";
import * as action from "../actions";
import { getItems } from "../selectors";
import { createStructuredSelector } from "reselect";
import eventBus from "eventBus";

let intervalToken, connectionOpenToken, connectionCloseToken;

class Status extends React.Component {
  componentWillMount() {
    this.props.startIpfsMonitor();

    connectionOpenToken = eventBus.subscribe("connection_open", session => {
      this.props.startWampMonitor();
    });

    // This code can lead to errors, and not showing the user that the connection is broken
    // If activated, on errors the user may not be alerted that the connection is restablished
    // connectionCloseToken = eventBus.subscribe("connection_close", () => {
    //   clearInterval(intervalToken);
    // });
  }
  componentWillUnmount() {
    eventBus.unsubscribe(connectionOpenToken);
    eventBus.unsubscribe(connectionCloseToken);
    clearInterval(intervalToken);
  }
  render() {
    return null;
  }
}

const mapStateToProps = createStructuredSelector({
  items: getItems
});

const mapDispatchToProps = dispatch => {
  return {
    startIpfsMonitor: () => {
      dispatch(action.startIpfsMonitor());
    },
    startWampMonitor: () => {
      dispatch(action.startWampMonitor());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
