import React from "react";
import DeviceList from "./DeviceList";
import status from "status";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";

class DevicesView extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      deviceName: "",
      deviceId: ""
    };
  }

  handleAddDevice() {
    this.props.addDevice(this.state.deviceName);
  }

  removeDevice(id) {
    this.props.removeDevice(id);
  }

  toggleAdmin(id, isAdmin) {
    this.props.toggleAdmin(id, isAdmin);
  }

  updateDeviceName(e) {
    this.setState({
      deviceName: e.target.value
    });
  }

  updateDeviceId(e) {
    this.setState({
      deviceId: e.target.value
    });
  }

  render() {
    return (
      <div>
        <status.components.DependenciesAlert
          deps={["wamp", "vpn", "externalIP"]}
        />
        <h1>Device manager</h1>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Device's unique name"
            aria-label="Device's unique name"
            aria-describedby="basic-addon2"
            value={this.state.deviceName}
            onChange={this.updateDeviceName.bind(this)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.handleAddDevice.bind(this)}
            >
              Add device
            </button>
          </div>
        </div>

        <DeviceList
          deviceList={this.props.deviceList}
          removeDevice={this.removeDevice.bind(this)}
          toggleAdmin={this.toggleAdmin.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  deviceList: selector.getDevices
});

const mapDispatchToProps = dispatch => {
  return {
    addDevice: id => {
      // Ensure id contains only alphanumeric characters
      const correctedId = id.replace(/\W/g, "");
      dispatch(action.add(correctedId));
    },
    removeDevice: id => {
      dispatch(action.remove(id));
    },
    toggleAdmin: id => {
      dispatch(action.toggleAdmin(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesView);
