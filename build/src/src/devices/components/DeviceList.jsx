import React from "react";
import ClipboardJS from "clipboard";
import { NavLink } from "react-router-dom";
import QRCode from "qrcode.react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "./adminBadge.css";

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

    const margin = "5px";
    const padding = "0.7rem";
    const width = "100px";

    const ip = device.ip || "";
    const badge = ip.startsWith("172.33.10.") ? (
      <span className="adminBadge">ADMIN</span>
    ) : null;

    return (
      <div class="card mb-3" id={id}>
        <div class="card-body" style={{ padding }}>
          <div>
            <div class="float-left" style={{ margin, width: "170px" }}>
              <h5 class="card-title">{device.name}</h5>
              <p class="card-text">
                {device.ip}
                {badge}
              </p>
            </div>
            <div>
              <div
                className="btn-group float-right"
                role="group"
                style={{ margin }}
              >
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ width }}
                  disabled={isAdmin}
                  id={id}
                  onClick={this.removeDevice.bind(this, id)}
                >
                  Remove
                </button>
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  style={{ width }}
                  defaultChecked={isAdmin}
                  onClick={this.props.toggleAdmin.bind(this, id, isAdmin)}
                >
                  Do admin
                </button>
              </div>
              <div
                className="btn-group float-right"
                role="group"
                style={{ margin }}
              >
                <NavLink to={"/devices/" + id}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    style={{
                      width,
                      borderBottomRightRadius: "0px",
                      borderTopRightRadius: "0px",
                      borderRightColor: "white",
                      position: "relative",
                      left: "1px"
                    }}
                  >
                    Show QR
                  </button>
                </NavLink>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  style={{ width }}
                  data-clipboard-text={url}
                >
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class DeviceList extends React.Component {
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
        />
      );
    }

    return <div>{rows}</div>;
  }
}
