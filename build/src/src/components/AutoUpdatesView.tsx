import React, { useEffect, useState } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as api from "API/calls";
// Components
import Switch from "components/Switch";
// Utils
import { shortNameCapitalized } from "utils/format";
import { parseStaticDate, parseDiffDates } from "utils/dates";
// External
import { getAutoUpdateData } from "services/dappnodeStatus/selectors";
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
import { coreName } from "services/coreUpdate/data";
import { autoUpdateIds } from "services/dappnodeStatus/data";
import { rootPath as installerRootPath } from "pages/installer";
import { rootPath as systemRootPath, updatePath } from "pages/system/data";
// Styles
import "./autoUpdates.scss";
import { AutoUpdateDataView, ProgressLogsByDnp } from "types";

const { MY_PACKAGES, SYSTEM_PACKAGES } = autoUpdateIds;
const getIsSinglePackage = (id: string) =>
  id !== MY_PACKAGES && id !== SYSTEM_PACKAGES;

function AutoUpdatesView({
  autoUpdateData,
  progressLogsByDnp,
  onlySummary
}: {
  autoUpdateData?: AutoUpdateDataView;
  progressLogsByDnp?: ProgressLogsByDnp;
  onlySummary?: boolean;
}) {
  const { dnpsToShow = [] } = autoUpdateData || {};

  // Force a re-render every 15 seconds for the timeFrom to show up correctly
  const [, setClock] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setClock(n => n + 1), 15 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function setUpdateSettings(id: string, enabled: boolean): void {
    api
      .autoUpdateSettingsEdit(
        { id, enabled },
        {
          toastMessage: onlySummary
            ? undefined
            : `${
                enabled ? "Enabling" : "Disabling"
              } auto updates for ${shortNameCapitalized(id)}...`
        }
      )
      .catch(e => console.error(`Error on autoUpdateSettingsEdit: ${e.stack}`));
  }

  return (
    <div className="list-grid auto-updates">
      {/* Table header */}
      <span className="stateBadge" />
      <span className="name" />
      <span className="last-update header">
        {onlySummary ? "" : "Last auto-update"}
      </span>
      <span className="header">Enabled</span>

      <hr />
      {/* Items of the table */}
      {dnpsToShow
        .filter(dnp => !onlySummary || !getIsSinglePackage(dnp.id))
        .map(({ id, displayName, enabled, feedback }) => (
          <AutoUpdateItem
            key={id}
            {...{
              id,
              displayName,
              enabled,
              feedback,
              isInstalling: Boolean(
                (progressLogsByDnp || {})[
                  id === SYSTEM_PACKAGES ? coreName : id
                ]
              ),
              isSinglePackage: getIsSinglePackage(id),
              onlySummary,
              // Actions
              setUpdateSettings
            }}
          />
        ))}
    </div>
  );
}

function AutoUpdateItem({
  id,
  displayName,
  enabled,
  feedback,
  isInstalling,
  isSinglePackage,
  onlySummary,
  // Actions
  setUpdateSettings
}: {
  id: string;
  displayName: string;
  enabled: boolean;
  feedback: any;
  isInstalling: boolean;
  isSinglePackage: boolean;
  onlySummary?: boolean;
  setUpdateSettings: (id: string, enable: boolean) => void;
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

  const showUpdateLink = (isInstalling || inQueue || scheduled) && !onlySummary;

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
        {showUpdateLink && dnpInstallPath ? (
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
        label=""
      />

      {!collapsed && <div className="extra-info">{errorMessage}</div>}

      <hr />
    </React.Fragment>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  autoUpdateData: getAutoUpdateData,
  progressLogsByDnp: getProgressLogsByDnp
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdatesView);
