import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// Components
import Card from "components/Card";
import Switch from "components/Switch";
import { ButtonLight } from "components/Button";
// Icons
import { MdDelete, MdRefresh } from "react-icons/md";

function DeviceGrid({ devices, removeDevice, resetDevice, toggleAdmin }) {
  return (
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
  );
}

DeviceGrid.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      admin: PropTypes.bool.isRequired,
      url: PropTypes.string
    })
  ).isRequired,
  removeDevice: PropTypes.func.isRequired,
  resetDevice: PropTypes.func.isRequired,
  toggleAdmin: PropTypes.func.isRequired
};

export default DeviceGrid;
