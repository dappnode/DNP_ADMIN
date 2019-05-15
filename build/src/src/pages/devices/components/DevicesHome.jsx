import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
// Own module
import DeviceGrid from "./DeviceGrid";
import * as a from "../actions";
import { title, maxIdLength } from "../data";
import coerceDeviceName from "../helpers/coerceDeviceName";
// Services
import { getDevices } from "services/devices/selectors";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
import Title from "components/Title";

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
      <Title title={title} />

      <Input
        placeholder="Device's unique name"
        value={id}
        // Ensure id contains only alphanumeric characters
        onValueChange={value => setId(coerceDeviceName(value))}
        onEnterPress={() => {
          addDevice(id);
          setId("");
        }}
        append={
          <ButtonLight onClick={() => addDevice(id)}>Add device</ButtonLight>
        }
      />

      {id.length === maxIdLength ? (
        <div className="alert alert-warning">
          Device name must be shorter than {maxIdLength} characters
        </div>
      ) : null}

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
