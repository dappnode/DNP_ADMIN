import React from "react";
import DeviceList from "./DeviceList";
import status from "status";
import eventBus from "eventBus";
import { isOpen } from "API/crossbarCalls";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { NavLink } from "react-router-dom";
import QRCode from "qrcode.react";
import "./adminBadge.css";

let token;

class DevicesView extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      deviceName: "",
      deviceId: ""
    };
  }

  componentWillMount() {
    token = eventBus.subscribe("connection_open", this.props.fetchDevices);
    if (isOpen()) this.props.fetchDevices();
  }
  componentWillUnmount() {
    eventBus.unsubscribe(token);
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
    const id = this.props.match.params.id;
    const device = this.props.deviceList.find(device => device.name === id);
    let url = device.otp || "";

    const margin = "5px";
    const padding = "0.7rem";
    // <QRCode
    //   value={url}
    //   renderAs="svg"
    //   style={{ width: "100%", height: "100%" }}
    // />
    const ip = device.ip || "";
    const badge = ip.startsWith("172.33.10.") ? (
      <span className="adminBadge">ADMIN</span>
    ) : null;

    return (
      <div>
        <div class="card mb-3" id={id}>
          <div class="card-body" style={{ padding }}>
            <div>
              <div class="float-left" style={{ margin, width: "200px" }}>
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
                  <NavLink to={"/devices/"}>
                    <button type="button" className="btn btn-outline-secondary">
                      Back
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>

            <div style={{ maxWidth: "400px", margin }}>
              <QRCode
                value={url}
                renderAs="svg"
                style={{ width: "100%", height: "100%" }}
              />
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
  return {
    addDevice: id => {
      // Ensure id contains only alphanumeric characters
      const correctedId = id.replace(/\W/g, "");
      dispatch(action.add(correctedId));
    },
    removeDevice: id => {
      dispatch(action.remove(id));
    },
    toggleAdmin: id => {
      dispatch(action.toggleAdmin(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesView);
