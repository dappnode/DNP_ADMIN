import React from 'react';
import * as VPNcall from './API/crossbarCalls';
import DeviceList from './DeviceList';
import LogMessage from './LogMessage';
import AppStore from 'Store';

export default class VPNCalls extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      deviceName: '',
      deviceId: '',
      deviceList: AppStore.getDeviceList()
    };
  }
  componentWillMount() {
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

  removeDeviceInTable(e) {
    VPNcall.removeDevice(e.currentTarget.id);
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
      <div class='body'>
        <br></br>
        Device name:
        <input value={this.state.deviceName}
        onChange={this.updateDeviceName.bind(this)}/>
        <button
        onClick={this.handleAddDevice.bind(this)}>Add device</button>
        <br></br>
        <br></br>
        <LogMessage />
        <br></br>
        <DeviceList
          deviceList={this.state.deviceList}
          removeDevice={this.removeDeviceInTable.bind(this)}
        />
      </div>
    );
  }
}

// PARKING
  // the reload buttons
  // <button
  // onClick={this.handleReloadDeviceList.bind(this)}>Reload device list</button>
