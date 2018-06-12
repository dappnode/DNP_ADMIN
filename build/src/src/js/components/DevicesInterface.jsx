import React from 'react';
import * as VPNcall from './API/crossbarCalls';
import DeviceList from './DeviceList';
import LogMessage from './LogMessage';
import AppStore from 'Store';

export default class DevicesInterface extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      deviceName: '',
      deviceId: '',
      deviceList: AppStore.getDeviceList()
    };
  }
  componentDidMount() {
    AppStore.on("CHANGE", this.updateDeviceList.bind(this));
  }
  componentWillUnmount() {
    AppStore.removeListener("CHANGE", this.updateDeviceList.bind(this));
  }
  handleAddDevice() {
    VPNcall.addDevice(this.state.deviceName);
    // session.'vpn.dappnode.addDevice'
  }
  handleRemoveDevice() {
    VPNcall.removeDevice(this.state.deviceId);
  }
  handleReloadDeviceList() {
    VPNcall.listDevices();
  }

  removeDevice(id) {
    VPNcall.removeDevice(id);
  }

  toggleAdmin(id, isAdmin) {
    VPNcall.toggleAdmin(id, isAdmin)
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

  updateDeviceList() {
    this.setState({
      deviceList: AppStore.getDeviceList()
    });
  }

  render() {
    return (
      <div>

        <h1>Device manager</h1>
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Device's unique name" aria-label="Device's unique name" aria-describedby="basic-addon2"
            value={this.state.deviceName}
            onChange={this.updateDeviceName.bind(this)}
          ></input>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button"
              onClick={this.handleAddDevice.bind(this)}
            >Add device</button>
          </div>
        </div>

        <DeviceList
          deviceList={this.state.deviceList}
          removeDevice={this.removeDevice.bind(this)}
          toggleAdmin={this.toggleAdmin.bind(this)}
        />
        <br></br>
        <br></br>

        <LogMessage />

      </div>
    );
  }
}

// PARKING
  // the reload buttons
  // <button
  // onClick={this.handleReloadDeviceList.bind(this)}>Reload device list</button>
