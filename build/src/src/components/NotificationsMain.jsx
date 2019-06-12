import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
// Selectors
import {
  getCoreUpdateAvailable,
  getUpdatingCore
} from "services/coreUpdate/selectors";
import { getAreWifiCredentialsDefault } from "services/dnpInstalled/selectors";
import { getIsWifiRunning } from "services/dappnodeStatus/selectors";
import { rootPath as systemRootPath, updatePath } from "pages/system/data";

/**
 * [SYSTEM-UPDATE]
 * Notification to tell the user to update the system
 */
const systemUpdateNotificationId = "systemUpdateNotificationId";
const systemUpdateNotification = (
  <div
    id={systemUpdateNotificationId}
    className="alert alert-warning alert-dismissible show"
    role="alert"
  >
    <Link
      className="btn btn-warning float-right"
      style={{ marginLeft: "0.5rem" }}
      to={systemRootPath + "/" + updatePath}
    >
      Update
    </Link>
    <p>
      <strong>DAppNode system update available.</strong> Click{" "}
      <strong>Update </strong>
      to review and approve it
    </p>

    <button
      type="button"
      className="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);

/**
 * [WIFI-PASSWORD]
 * Notification to tell the user to change the wifi credentials
 */
const wifiCredentialsNotificationId = "wifiCredentialsNotificationId";
const wifiCredentialsNotification = (
  <div
    id={wifiCredentialsNotificationId}
    className="alert alert-warning alert-dismissible show"
    role="alert"
  >
    <Link
      className="btn btn-warning float-right"
      style={{ marginLeft: "0.5rem" }}
      to={systemRootPath + "/wifi.dnp.dappnode.eth"}
    >
      Change
    </Link>
    <p>
      <strong>Change the DAppNode WIFI credentials</strong>, they are insecure
      default values.
    </p>

    <button
      type="button"
      className="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);

/**
 * Aggregate notification and display logic
 */
const NotificationsView = ({
  coreUpdateAvailable,
  updatingCore,
  areWifiCredentialsDefault,
  isWifiRunning
}) => {
  return (
    <div>
      {coreUpdateAvailable && !updatingCore ? systemUpdateNotification : null}
      {areWifiCredentialsDefault && isWifiRunning
        ? wifiCredentialsNotification
        : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  coreUpdateAvailable: getCoreUpdateAvailable,
  updatingCore: getUpdatingCore,
  areWifiCredentialsDefault: getAreWifiCredentialsDefault,
  isWifiRunning: getIsWifiRunning
});

export default connect(
  mapStateToProps,
  null
)(NotificationsView);
