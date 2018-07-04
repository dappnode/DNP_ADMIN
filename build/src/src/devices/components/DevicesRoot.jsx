import React from "react";
import { Route } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import * as action from "../actions";
import { NAME } from "../constants";
import eventBus from "eventBus";
// Components
import DeviceSettings from "./DeviceSettings";
import Devices from "./Devices";
// Logic
import { isOpen } from "API/crossbarCalls";

let token;

class DevicesRootView extends React.Component {
  componentWillMount() {
    token = eventBus.subscribe("connection_open", this.props.fetchDevices);
    if (isOpen()) this.props.fetchDevices();
  }
  componentWillUnmount() {
    eventBus.unsubscribe(token);
  }

  render() {
    console.log("rendering devices");
    return (
      <div>
        <Route exact path={"/" + NAME} component={Devices} />
        <Route path={"/" + NAME + "/:id"} component={DeviceSettings} />
      </div>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => {
  return {
    fetchDevices: () => {
      dispatch(action.list());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesRootView);
