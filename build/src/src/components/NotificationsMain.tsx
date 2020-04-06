import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { NavLink } from "react-router-dom";
import RenderMarkdown from "components/RenderMarkdown";
// Selectors
import {
  getCoreUpdateAvailable,
  getIsCoreUpdateTypePatch,
  getUpdatingCore
} from "services/coreUpdate/selectors";
import { getAreWifiCredentialsDefault } from "services/dnpInstalled/selectors";
import {
  getIsWifiRunning,
  getPasswordIsInsecure,
  getIsCoreAutoUpdateActive
} from "services/dappnodeStatus/selectors";
import {
  rootPath as systemRootPath,
  subPaths as systemSubPaths
} from "pages/system/data";
import Alert from "react-bootstrap/Alert";
import Button from "components/Button";
// Style
import "./notificationsMain.scss";

function AlertDismissible({
  body,
  linkText,
  linkPath
}: {
  body: string;
  linkText: string;
  linkPath: string;
}) {
  const [show, setShow] = useState(true);
  return show ? (
    <Alert
      variant="warning"
      onClose={() => setShow(false)}
      dismissible
      className="main-notification"
    >
      {/* <Alert.Heading>Oh snap! You got an error!</Alert.Heading> */}
      <RenderMarkdown source={body} />
      <NavLink to={linkPath}>
        <Button variant={"warning"}>{linkText}</Button>
      </NavLink>
    </Alert>
  ) : null;
}

/**
 * Aggregate notification and display logic
 */
const NotificationsView = ({
  coreUpdateAvailable,
  updatingCore,
  isCoreUpdateTypePatch,
  isCoreAutoUpdateActive,
  areWifiCredentialsDefault,
  isWifiRunning,
  passwordIsInsecure
}: {
  coreUpdateAvailable?: boolean;
  updatingCore?: boolean;
  isCoreUpdateTypePatch?: boolean;
  isCoreAutoUpdateActive?: boolean;
  areWifiCredentialsDefault?: boolean;
  isWifiRunning?: boolean;
  passwordIsInsecure?: boolean;
}) => {
  const notifications = [
    /**
     * [SYSTEM-UPDATE]
     * Tell the user to update the core DNPs
     */
    {
      id: "systemUpdate",
      linkText: "Update",
      linkPath: systemRootPath + "/" + systemSubPaths.update,
      body:
        "**DAppNode system update available.** Click **Update** to review and approve it",
      active:
        coreUpdateAvailable &&
        !updatingCore &&
        // Show if NOT patch, or if patch is must not be active
        (!isCoreUpdateTypePatch || !isCoreAutoUpdateActive)
    },
    /**
     * [WIFI-PASSWORD]
     * Tell the user to change the wifi credentials
     */
    {
      id: "wifiCredentials",
      linkText: "Change",
      linkPath: systemRootPath + "/" + systemSubPaths.security,
      body:
        "**Change the DAppNode WIFI credentials**, they are insecure default values.",
      active: areWifiCredentialsDefault && isWifiRunning
    },
    /**
     * [HOST-USER-PASSWORD]
     * Tell the user to change the host's "dappnode" user password
     */
    {
      id: "hostPasswordInsecure",
      linkText: "Change",
      linkPath: systemRootPath + "/" + systemSubPaths.security,
      body:
        "**Change the host 'dappnode' user password**, it's an insecure default.",
      active: passwordIsInsecure
    }
  ];

  return (
    <div>
      {notifications
        .filter(({ active }) => active)
        .map(({ id, linkText, linkPath, body }) => (
          <AlertDismissible key={id} {...{ linkText, linkPath, body }} />
        ))}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  coreUpdateAvailable: getCoreUpdateAvailable,
  updatingCore: getUpdatingCore,
  isCoreUpdateTypePatch: getIsCoreUpdateTypePatch,
  isCoreAutoUpdateActive: getIsCoreAutoUpdateActive,
  areWifiCredentialsDefault: getAreWifiCredentialsDefault,
  isWifiRunning: getIsWifiRunning,
  passwordIsInsecure: getPasswordIsInsecure
});

export default connect(
  mapStateToProps,
  null
)(NotificationsView);
