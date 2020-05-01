import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { NavLink } from "react-router-dom";
// Own module
import * as a from "../actions";
import { title, maxIdLength } from "../data";
import coerceDeviceName from "../helpers/coerceDeviceName";
import { VpnDeviceState } from "services/devices/types";
// Services
import { getDevices } from "services/devices/selectors";
// Components
import Input from "components/Input";
import Button from "components/Button";
import Title from "components/Title";
import Card from "components/Card";
import Switch from "components/Switch";
import { ButtonLight } from "components/Button";
// Icons
import { MdDelete, MdRefresh } from "react-icons/md";

const DevicesHome = ({
  devices,
  addDevice,
  removeDevice,
  resetDevice,
  toggleAdmin
}: {
  devices: VpnDeviceState[];
  addDevice: (id: string) => void;
  removeDevice: (id: string) => void;
  resetDevice: (id: string) => void;
  toggleAdmin: (id: string) => void;
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

      <Card className="list-grid devices">
        <header>Name</header>
        <header className="center">Credentials</header>
        <header>Admin</header>
        <header>Reset</header>
        <header>Remove</header>
        {devices.map(({ id, admin, url }) => (
          <React.Fragment key={id}>
            <div className="name">{id}</div>
            <NavLink to={"/devices/" + id} className="no-a-style">
              <ButtonLight className="get-link">Get</ButtonLight>
            </NavLink>

            <Switch checked={admin} onToggle={() => toggleAdmin(id)} />
            <MdRefresh
              style={{ fontSize: "1.05rem" }}
              onClick={() => resetDevice(id)}
            />
            <MdDelete
              className={admin ? "disabled" : ""}
              onClick={() => (admin ? null : removeDevice(id))}
            />
            <hr />
          </React.Fragment>
        ))}
      </Card>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  devices: getDevices
});

const mapDispatchToProps = {
  addDevice: a.addDevice,
  removeDevice: a.removeDevice,
  resetDevice: a.resetDevice,
  toggleAdmin: a.toggleAdmin
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesHome);
