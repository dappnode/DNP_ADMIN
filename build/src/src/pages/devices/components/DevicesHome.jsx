import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
// Own module
import DeviceGrid from "./DeviceGrid";
import * as a from "../actions";
// Services
import { getDevices } from "services/devices/selectors";
// Components
import Input from "components/Input";
import Button from "components/Button";

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
    <>
      <div className="section-title">Devices</div>

      <Input
        placeholder="Device's unique name"
        value={id}
        // Ensure id contains only alphanumeric characters
        onValueChange={value => setId((value || "").replace(/\W/g, ""))}
        onEnterPress={() => {
          addDevice(id);
          setId("");
        }}
        append={
          <Button variant="outline-secondary" onClick={() => addDevice(id)}>
            Add device
          </Button>
        }
      />

      <DeviceGrid
        devices={deviceList}
        removeDevice={removeDevice}
        resetDevice={resetDevice}
        toggleAdmin={toggleAdmin}
        getDeviceCredentials={getDeviceCredentials}
      />
    </>
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
