import React, { useState } from "react";
import { connect } from "react-redux";
import * as a from "../actions";
import { createStructuredSelector } from "reselect";
import DeviceList from "./DeviceList";
import { getDevices } from "services/devices/selectors";
// Utils
import onEnterKey from "utils/onEnterKey";

const DevicesHome = ({
  deviceList,
  addDevice,
  removeDevice,
  resetDevice,
  toggleAdmin,
  getDeviceCredentials
}) => {
  const [id, setId] = useState("");
  return (
    <React.Fragment>
      <div className="section-title">Devices</div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Device's unique name"
          value={id}
          // Ensure id contains only alphanumeric characters
          onChange={e => setId((e.target.value || "").replace(/\W/g, ""))}
          onKeyPress={onEnterKey(() => {
            addDevice(id);
            setId("");
          })}
        />
        <div className="input-groupWithoutGuest-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => addDevice(id)}
          >
            Add device
          </button>
        </div>
      </div>

      <DeviceList
        deviceList={deviceList}
        removeDevice={removeDevice}
        resetDevice={resetDevice}
        toggleAdmin={toggleAdmin}
        getDeviceCredentials={getDeviceCredentials}
      />
    </React.Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  deviceList: getDevices
});

const mapDispatchToProps = {
  addDevice: a.addDevice,
  getDeviceCredentials: a.getDeviceCredentials,
  removeDevice: a.removeDevice,
  resetDevice: a.resetDevice,
  toggleAdmin: a.toggleAdmin
};

// withLoading is applied at DevicesRoot
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesHome);
