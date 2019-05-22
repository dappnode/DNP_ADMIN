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
import Button from "components/Button";
import Title from "components/Title";

const DevicesHome = ({
  deviceList,
  addDevice,
  removeDevice,
  resetDevice,
  toggleAdmin
}) => {
  const [id, setId] = useState("");
  const idTooLong = id.length === maxIdLength;
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
          <Button
            variant="dappnode"
            onClick={() => addDevice(id)}
            disabled={idTooLong}
          >
            Add device
          </Button>
        }
      />

      {idTooLong ? (
        <div className="color-danger">
          Device name must be shorter than {maxIdLength} characters
        </div>
      ) : null}

      <DeviceGrid
        devices={deviceList}
        removeDevice={removeDevice}
        resetDevice={resetDevice}
        toggleAdmin={toggleAdmin}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  deviceList: getDevices
});

const mapDispatchToProps = {
  addDevice: a.addDevice,
  removeDevice: a.removeDevice,
  resetDevice: a.resetDevice,
  toggleAdmin: a.toggleAdmin
};

// withLoading is applied at DevicesRoot
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesHome);
