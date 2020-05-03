import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
// Own module
import * as a from "../actions";
import { title, maxIdLength } from "../data";
import coerceDeviceName from "../helpers/coerceDeviceName";
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
import { superAdminId } from "params";

export default function DevicesHome() {
  const devices = useSelector(getDevices);
  const dispatch = useDispatch();
  const addDevice = (id: string) => dispatch(a.addDevice(id));
  const removeDevice = (id: string) => dispatch(a.removeDevice(id));
  const resetDevice = (id: string) => dispatch(a.resetDevice(id));
  const toggleAdmin = (id: string) => dispatch(a.toggleAdmin(id));

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
        {[...devices]
          // Sort super admin device as first
          .sort(d1 => (d1.id === superAdminId ? -1 : 0))
          .map(({ id, admin }) => (
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
}
