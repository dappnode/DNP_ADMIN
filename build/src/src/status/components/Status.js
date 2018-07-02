import React from "react";
import { connect } from "react-redux";
import * as action from "../actions";
import { getItems } from "../selectors";
import { createStructuredSelector } from "reselect";
import eventBus from "eventBus";

let intervalToken, connectionOpenToken, connectionCloseToken;

class Status extends React.Component {
  componentWillMount() {
    this.props.init();

    intervalToken = setInterval(() => {
      this.props.check();
    }, 5 * 1000);

    connectionOpenToken = eventBus.subscribe("connection_open", session => {
      this.props.check(session);
    });

    // eventBus.subscribe("connection_close", err => {
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
    check: () => {
      dispatch(action.check());
    },
    init: () => {
      dispatch(action.init());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
