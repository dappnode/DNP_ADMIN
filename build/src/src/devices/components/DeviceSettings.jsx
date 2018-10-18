import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { NavLink } from "react-router-dom";
import QRCode from "qrcode.react";
import "./adminBadge.css";
import { guestsName, guestsIpRange } from "../constants";

class DevicesSettings extends React.Component {
  render() {
    const id = this.props.match.params.id;
    const device = this.props.deviceList.find(device => device.name === id);

    const margin = "5px";
    const padding = "0.7rem";
    // <QRCode
    //   value={url}
    //   renderAs="svg"
    //   style={{ width: "100%", height: "100%" }}
    // />
    const name = device ? device.name : "Device not found";
    const url = device ? device.otp || "" : null;
    let ip = device ? device.ip || "" : "Go back to the device list";
    const badge = ip.startsWith("172.33.10.") ? (
      <span className="adminBadge">ADMIN</span>
    ) : null;

    if (name === guestsName) {
      ip = guestsIpRange;
    }

    return (
      <div>
        <div className="section-title">
          <span style={{ opacity: 0.3, fontWeight: 300 }}>Devices </span>
          {name}
        </div>
        <div className="card mb-3" id={id}>
          <div className="card-body" style={{ padding }}>
            <div>
              <div className="float-left" style={{ margin, width: "200px" }}>
                <h5 className="card-title">{name}</h5>
                <p className="card-text">
                  {ip}
                  {badge}
                </p>
              </div>
              <div>
                <div
                  className="btn-group float-right"
                  role="group"
                  style={{ margin }}
                >
                  <NavLink to={"/devices/"}>
                    <button type="button" className="btn btn-outline-secondary">
                      Back
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>

            <div style={{ maxWidth: "400px", margin }}>
              {device ? (
                <QRCode
                  value={url}
                  renderAs="svg"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  deviceList: selector.getDevices
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesSettings);
