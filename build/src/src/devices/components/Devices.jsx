import React from "react";
import status from "status";
import { connect } from "react-redux";
import * as actions from "../actions";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import DeviceList from "./DeviceList";
import GuestUsers from "./GuestUsers";
import Loading from "components/generic/Loading";

const enableGuestUsers = false;

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

  updateDeviceName(e) {
    this.setState({
      deviceName: e.target.value
    });
  }

  render() {
    return (
      <React.Fragment>
        <status.components.DependenciesAlert
          deps={["wamp", "vpn", "externalIP"]}
        />
        <div className="section-title">Devices</div>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Device's unique name"
            aria-label="Device's unique name"
            aria-describedby="basic-addon2"
            value={this.state.deviceName}
            onChange={this.updateDeviceName.bind(this)}
            onKeyPress={e => {
              if (e.key === "Enter") this.handleAddDevice.bind(this)();
            }}
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

        {this.props.fetching && this.props.deviceList.length === 0 ? (
          <Loading msg="Loading device list..." />
        ) : (
          <React.Fragment>
            <DeviceList
              deviceList={this.props.deviceList}
              removeDevice={this.props.removeDevice}
              resetDevice={this.props.resetDevice}
              toggleAdmin={this.props.toggleAdmin}
              getDeviceCredentials={this.props.getDeviceCredentials}
            />

            {enableGuestUsers && this.props.deviceList.length ? (
              <GuestUsers
                guestUsersDevice={this.props.guestUsersDevice}
                toggleGuestUsers={this.props.toggleGuestUsers}
                resetGuestUsersPassword={this.props.resetGuestUsersPassword}
              />
            ) : null}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  deviceList: selector.getDevicesWithoutGuest,
  guestUsersDevice: selector.getGuestUsersDevice,
  fetching: selector.getFetching
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  // Ensure id contains only alphanumeric characters
  addDevice: id => actions.addDevice(id.replace(/\W/g, "")),
  getDeviceCredentials: actions.getDeviceCredentials,
  removeDevice: actions.removeDevice,
  resetDevice: actions.resetDevice,
  toggleAdmin: actions.toggleAdmin,
  toggleGuestUsers: actions.toggleGuestUsers,
  resetGuestUsersPassword: actions.resetGuestUsersPassword
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesView);
