import React from "react";
import DeviceList from "./DeviceList";

export default class DevicesView extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      deviceName: "",
      deviceId: ""
    };
  }

  componentDidMount() {
    this.props.fetchDevices();
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
