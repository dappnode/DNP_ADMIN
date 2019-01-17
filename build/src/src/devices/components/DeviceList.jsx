import React from "react";
import ClipboardJS from "clipboard";
import { NavLink } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "./adminBadge.css";

new ClipboardJS(".btn");

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

  render() {
    const device = this.props.device;
    const { id, url, isAdmin, ip } = device;

    const margin = "5px";
    const padding = "0.7rem";
    const width = "108px";

    return (
      <div className="card mb-3" id={id}>
        <div className="card-body" style={{ padding }}>
          <div>
            <div className="float-left" style={{ margin, width: "170px" }}>
              <h5 className="card-title">{id}</h5>
              <p className="card-text">
                {ip && <span className="ipBadge">{ip}</span>}
                {isAdmin && <span className="adminBadge">ADMIN</span>}
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
                  style={{ width, paddingLeft: "0px", paddingRight: "0px" }}
                  defaultChecked={isAdmin}
                  onClick={() => this.props.toggleAdmin(id, isAdmin)}
                >
                  {isAdmin ? "Undo admin" : "Do admin"}
                </button>
              </div>
              <div
                className="btn-group float-right"
                role="group"
                style={{ margin }}
              >
                {!url && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    style={{ width }}
                    onClick={() => this.props.getDeviceCredentials(id)}
                  >
                    Get link
                  </button>
                )}
                {url && (
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
                )}
                {url && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    style={{ width }}
                    data-clipboard-text={url}
                  >
                    Copy link
                  </button>
                )}
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
    return (
      <div>
        {(this.props.deviceList || []).map((device, i) => (
          <Row
            key={i}
            device={device}
            removeDevice={this.props.removeDevice}
            toggleAdmin={this.props.toggleAdmin}
            getDeviceCredentials={this.props.getDeviceCredentials}
          />
        ))}
      </div>
    );
  }
}
