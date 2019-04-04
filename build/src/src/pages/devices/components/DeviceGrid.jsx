import React, { useEffect } from "react";
import ClipboardJS from "clipboard";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// Confirm
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
// Components
import Card from "components/Card";
import Switch from "components/Switch";
import { ButtonLight } from "components/Button";
// Icons
import { MdDelete, MdRefresh } from "react-icons/md";
import { FaQrcode } from "react-icons/fa";
import { GoClippy } from "react-icons/go";
import "./devices.css";

function DeviceGrid({
  devices,
  removeDevice,
  resetDevice,
  toggleAdmin,
  getDeviceCredentials
}) {
  // Activate the copy functionality
  useEffect(() => {
    new ClipboardJS(".copy");
  }, []);

  function removeDeviceConfirm(id) {
    confirmAlert({
      title: "Removing " + id + " device",
      message: "Are you sure?",
      buttons: [
        { label: "Yes", onClick: () => removeDevice(id) },
        { label: "No", onClick: () => {} }
      ]
    });
  }

  function resetDeviceConfirm(id) {
    confirmAlert({
      title: "Reseting " + id + " device",
      message:
        "All profiles and links pointing to this device will no longer be valid. Are you sure?",
      buttons: [
        { label: "Yes", onClick: () => resetDevice(id) },
        { label: "No", onClick: () => {} }
      ]
    });
  }

  return (
    <Card className="devices-grid">
      <header>Name</header>
      <header className="center">Link</header>
      <header>Admin</header>
      <header>Reset</header>
      <header>Remove</header>
      {devices.map(({ id, admin, url }) => (
        <React.Fragment key={id}>
          <aside>{id}</aside>
          {url ? (
            <div className="group">
              <NavLink to={"/devices/" + id}>
                <FaQrcode />
              </NavLink>
              <GoClippy className="copy" data-clipboard-text={url} />
            </div>
          ) : (
            <ButtonLight onClick={() => getDeviceCredentials(id)}>
              Get
            </ButtonLight>
          )}
          <Switch checked={admin} onToggle={() => toggleAdmin(id)} />
          <MdRefresh onClick={() => resetDeviceConfirm(id)} />
          <MdDelete onClick={() => removeDeviceConfirm(id)} />
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
  toggleAdmin: PropTypes.func.isRequired,
  getDeviceCredentials: PropTypes.func.isRequired
};

export default DeviceGrid;
