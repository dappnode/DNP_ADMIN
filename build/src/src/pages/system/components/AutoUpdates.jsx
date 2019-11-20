import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector, createSelector } from "reselect";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import api from "API/rpcMethods";
// Components
import Card from "components/Card";
import Switch from "components/Switch";
import Alert from "react-bootstrap/Alert";
// Utils
import { shortNameCapitalized } from "utils/format";
import { parseStaticDate, parseDiffDates } from "utils/dates";
// External
import { getAutoUpdateData } from "services/dappnodeStatus/selectors";
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { getMainnet } from "services/chainData/selectors";
import { getIsMainnetDnpNotRunning } from "services/dnpInstalled/selectors";
import { coreName } from "services/coreUpdate/data";
import { autoUpdateIds } from "services/dappnodeStatus/data";
import { rootPath as installerRootPath } from "pages/installer";
import { rootPath as systemRootPath, updatePath } from "pages/system/data";
// Styles
import "./autoUpdates.scss";

const { MY_PACKAGES, SYSTEM_PACKAGES } = autoUpdateIds;

function AutoUpdates({ autoUpdateData, progressLogsByDnp, mainnetBadStatus }) {
  const { dnpsToShow = [] } = autoUpdateData;

  // Force a re-render every 15 seconds for the timeFrom to show up correctly
  const [, setClock] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setClock(n => n + 1), 15 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function setUpdateSettings(id, enabled) {
    api.autoUpdateSettingsEdit(
      { id, enabled },
      {
        toastMessage: `${
          enabled ? "Enabling" : "Disabling"
        } auto updates for ${shortNameCapitalized(id)}...`
      }
    );
  }

  return (
    <Card>
      <div className="auto-updates-explanation">
        Enable auto-updates for DAppNode to stay automatically up to date to the
        latest versions. <strong>Note</strong> that for major breaking updates,
        the interaction of an admin will always be required.
      </div>

      {mainnetBadStatus && (
        <Alert variant="warning">
          {mainnetBadStatus}. Note that auto-updates will not work meanwhile.
        </Alert>
      )}

      <div className="list-grid auto-updates">
        {/* Table header */}
        <span className="stateBadge" />
        <span className="name" />
        <span className="last-update header">Last auto-update</span>
        <span className="header">Enabled</span>

        <hr />
        {/* Items of the table */}
        {dnpsToShow.map(({ id, displayName, enabled, feedback }) => (
          <AutoUpdateItem
            key={id}
            {...{
              id,
              displayName,
              enabled,
              feedback,
              isInstalling:
                progressLogsByDnp[id === SYSTEM_PACKAGES ? coreName : id],
              isSinglePackage: id !== MY_PACKAGES && id !== SYSTEM_PACKAGES,
              // Actions
              setUpdateSettings
            }}
          />
        ))}
      </div>
    </Card>
  );
}

function AutoUpdateItem({
  id,
  displayName,
  enabled,
  feedback,
  isInstalling,
  isSinglePackage,
  // Actions
  setUpdateSettings
}) {
  const [collapsed, setCollapsed] = useState(true);

  const { updated, manuallyUpdated, inQueue, scheduled } = feedback;
  const errorMessage = feedback.errorMessage;

  const dnpInstallPath =
    id === MY_PACKAGES
      ? null
      : id === SYSTEM_PACKAGES
      ? `${systemRootPath}/${updatePath}`
      : `${installerRootPath}/${id}`;

  const feedbackText = !enabled
    ? "-"
    : isInstalling
    ? "Updating..."
    : manuallyUpdated
    ? "Manually updated"
    : inQueue
    ? "In queue..."
    : scheduled
    ? `Scheduled, in ${parseDiffDates(scheduled)}`
    : updated
    ? parseStaticDate(updated)
    : "-";

  const showUpdateLink = isInstalling || inQueue || scheduled;

  return (
    <React.Fragment key={id}>
      <span
        className={`stateBadge center badge-${
          enabled ? "success" : "secondary"
        }`}
        style={{ opacity: 0.85 }}
      >
        <span className="content">{enabled ? "on" : "off"}</span>
      </span>

      <span className="name">
        {isSinglePackage && <span>> </span>}
        {displayName}
      </span>

      <span className="last-update">
        {showUpdateLink ? (
          <NavLink className="name" to={dnpInstallPath}>
            {feedbackText}
          </NavLink>
        ) : (
          <span>{feedbackText}</span>
        )}
        {errorMessage ? (
          <span className="error" onClick={() => setCollapsed(!collapsed)}>
            Error on update
          </span>
        ) : null}
      </span>

      <Switch
        checked={enabled ? true : false}
        onToggle={() => setUpdateSettings(id, !Boolean(enabled))}
      />

      {!collapsed && <div className="extra-info">{errorMessage}</div>}

      <hr />
    </React.Fragment>
  );
}

AutoUpdates.propTypes = {
  autoUpdateData: PropTypes.object.isRequired,
  progressLogsByDnp: PropTypes.object.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  autoUpdateData: getAutoUpdateData,
  progressLogsByDnp: getProgressLogsByDnp,
  mainnetBadStatus: createSelector(
    getMainnet,
    getIsMainnetDnpNotRunning,
    (mainnet, isMainnetDnpNotRunning) => {
      if (isMainnetDnpNotRunning) return "Mainnet is not running";
      if (!mainnet) return "Mainnet not found";
      if (mainnet.syncing) return "Mainnet is syncing";
      if (mainnet.error) return "Mainnet error";
      return null;
    }
  )
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);
