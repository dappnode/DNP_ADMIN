import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';

new ClipboardJS('.btn');

const ADMIN_STATIC_IP_PREFIX = '172.33.10.'

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let url = this.props.otp;
    const disableRemove = this.props.ip.includes(ADMIN_STATIC_IP_PREFIX)

    return (
      <tr id={this.props.id}>
        <td>{this.props.name}</td>
        <td>{this.props.ip}</td>

        <td>
          <div class="input-group mb-3">
            <a class="input-group-text" href={url}>link</a>
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" data-clipboard-text={url}>
              copy
              </button>
            </div>
          </div>
        </td>

        <td>
          <button type="button" class="btn btn-outline-danger"
            disabled={disableRemove}
            id={this.props.id}
            onClick={this.props.removeDevice}
          >remove</button>
        </td>

      </tr>
    );
  }
}

export default class DeviceList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rows = []
    let deviceList = this.props.deviceList || []
    for (let i = 0; i < deviceList.length; i++) {
      let device = deviceList[i]
      rows.push(
        <Row
          id={device.name}
          name={device.name}
          ip={device.ip}
          creationtime={device.creationtime}
          otp={device.otp}
          optexpirationtime={device.optexpirationtime}
          key={i}
          removeDevice={this.props.removeDevice}
        />
      );
    }

    return (
      <div>
        <table class='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>IP</th>
              <th>OTP</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
