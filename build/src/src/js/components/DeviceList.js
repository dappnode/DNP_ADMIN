import React from "react";
import params from "Params";
import ClipboardJS from 'clipboard';
import QRCode from 'qrcode.react';

new ClipboardJS('.btn');

const ADMIN_STATIC_IP_PREFIX = '172.33.10.'
const QR_MODAL_TAG = 'QR_MODAL_TAG'

class Row extends React.Component {

  removeDevice(id) {
    this.props.removeDevice(id)
  }

  toggleAdmin(id, isAdmin) {
    this.props.toggleAdmin(id, isAdmin)
  }

  updateSelectedDevice(id) {
    this.props.updateSelectedDevice(id)
  }

  render() {
    let device = this.props.device
    let url = device.otp;
    let id = device.name
    const isAdmin = device.ip.includes(ADMIN_STATIC_IP_PREFIX)

    return (
      <tr id={id}>
        <td>{device.name}</td>
        <td>{device.ip}</td>

        <td>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-secondary" data-toggle="modal"
              data-target={"#"+QR_MODAL_TAG}
              onClick={this.updateSelectedDevice.bind(this, id)}
              >
              QR
            </button>
            <button class="btn btn-outline-secondary" type="button" data-clipboard-text={url}>
            Copy
            </button>
          </div>
        </td>

        <td>
          <button type="button" class="btn btn-outline-danger"
            disabled={isAdmin}
            id={id}
            onClick={this.removeDevice.bind(this, id)}
          >Remove</button>
        </td>

        <td>
          <label class="container align-middle">
            <input type="checkbox"
              defaultChecked={isAdmin}
              onClick={this.props.toggleAdmin.bind(this, id, isAdmin)}
            ></input>
            <span class="checkmark"></span>
          </label>
        </td>

      </tr>
    );
  }
}



export default class DeviceList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: ''
    }
  }

  updateSelectedDevice(id) {
    this.setState({ id });
  }

  render() {
    let rows = []
    let deviceList = this.props.deviceList || []
    for (let i = 0; i < deviceList.length; i++) {
      let device = deviceList[i]
      rows.push(
        <Row
          device={device}
          key={i}
          removeDevice={this.props.removeDevice}
          toggleAdmin={this.props.toggleAdmin}
          updateSelectedDevice={this.updateSelectedDevice.bind(this)}
        />
      );
    }

    // Selected device
    let selectedDevice = deviceList.filter(d => d.name == this.state.id)[0]
    let url = selectedDevice ? selectedDevice.otp : '-'
    let name = selectedDevice ? selectedDevice.name : '-'
    let qrSize = (window.innerWidth > 600) ? 466 : Math.floor(0.85*window.innerWidth)

    return (
      <div class="table-responsive">
        <table class='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>IP</th>
              <th class="otp-link-th">OTP link</th>
              <th>Remove</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>

        <div class="modal fade" id={QR_MODAL_TAG} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">OTP QR code link for {name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body text-center">
                <QRCode
                  value={url}
                  size={qrSize}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
