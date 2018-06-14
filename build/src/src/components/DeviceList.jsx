import React from "react";
import ClipboardJS from "clipboard";
import QRCode from "qrcode.react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

new ClipboardJS(".btn");

const ADMIN_STATIC_IP_PREFIX = "172.33.10.";
const QR_MODAL_TAG = "QR_MODAL_TAG";

class Row extends React.Component {
  removeDevice(id) {
    confirmAlert({
      title: "Removing " + id + " device",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.props.removeDevice(id)
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  toggleAdmin(id, isAdmin) {
    this.props.toggleAdmin(id, isAdmin);
  }

  updateSelectedDevice(id) {
    this.props.updateSelectedDevice(id);
  }

  render() {
    let device = this.props.device;
    let url = device.otp;
    let id = device.name;
    const isAdmin = device.ip.includes(ADMIN_STATIC_IP_PREFIX);

    return (
      <tr id={id}>
        <td>{device.name}</td>
        <td>{device.ip}</td>

        <td>
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-toggle="modal"
              data-target={"#" + QR_MODAL_TAG}
              onClick={this.updateSelectedDevice.bind(this, id)}
            >
              QR
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              data-clipboard-text={url}
            >
              Copy
            </button>
          </div>
        </td>

        <td>
          <button
            type="button"
            className="btn btn-outline-danger"
            disabled={isAdmin}
            id={id}
            onClick={this.removeDevice.bind(this, id)}
          >
            Remove
          </button>
        </td>

        <td>
          <label className="container align-middle">
            <input
              type="checkbox"
              defaultChecked={isAdmin}
              onClick={this.props.toggleAdmin.bind(this, id, isAdmin)}
            />
            <span className="checkmark" />
          </label>
        </td>
      </tr>
    );
  }
}

export default class DeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
  }

  updateSelectedDevice(id) {
    this.setState({ id });
  }

  render() {
    let rows = [];
    let deviceList = this.props.deviceList || [];
    for (let i = 0; i < deviceList.length; i++) {
      let device = deviceList[i];
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
    let selectedDevice = deviceList.filter(d => d.name === this.state.id)[0];
    let url = selectedDevice ? selectedDevice.otp : "-";
    let name = selectedDevice ? selectedDevice.name : "-";

    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>IP</th>
              <th className="otp-link-th">OTP link</th>
              <th>Remove</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>

        <div
          className="modal fade"
          id={QR_MODAL_TAG}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  OTP QR code link for {name}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <QRCode
                  value={url}
                  renderAs="svg"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
