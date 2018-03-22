import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';

new ClipboardJS('.btn');

class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let url = params.otpUrl + '#' + this.props.otp;
    return (
      <tr id={this.props.id}>
        <td>{this.props.id}</td>
        <td>{this.props.name}</td>
        <td>{this.props.creationtime}</td>
        <td>
          <div class='otpUrlContainer'>
            <a class='otpUrl' href={url}>{url}</a>
          </div>
        </td>
        <td>
          <button class="btn" data-clipboard-text={url}>
          copy
          </button>
        </td>
        <td>{this.props.optexpirationtime}</td>
        <td>
          <button class='bttn'
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
    let rows = [];
    for (let i = 0; i < this.props.deviceList.length; i++) {
      let device = this.props.deviceList[i];
      rows.push(
        <Row
          id={device.id}
          name={device.name}
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
        <h1>Device list</h1>
        <table class='Table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Creation time</th>
              <th>OTP</th>
              <th></th>
              <th>OTP expiration time</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
