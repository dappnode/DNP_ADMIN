import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import semver from "semver";
import { NavLink } from "react-router-dom";
import api from "API/rpcMethods";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Switch from "components/Switch";
// Utils
import { shortNameCapitalized } from "utils/format";
import { parseStaticDate, parseDiffDates } from "utils/dates";
// External
import { getAutoUpdateData } from "services/dappnodeStatus/selectors";
import { getIsInstallingLogs } from "services/isInstallingLogs/selectors";
import { coreName } from "services/coreUpdate/data";
import { autoUpdateIds } from "services/dappnodeStatus/data";
import { rootPath as installerRootPath } from "pages/installer";
import { rootPath as systemRootPath, updatePath } from "pages/system/data";
// Styles
import "./autoUpdates.scss";

const { MY_PACKAGES, SYSTEM_PACKAGES } = autoUpdateIds;

function AutoUpdates({ autoUpdateData, progressLogs }) {
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
    <>
      <SubTitle>Auto-updates</SubTitle>
      <Card>
        <div className="auto-updates-explanation">
          Enable auto-updates for DAppNode to stay automatically up to date to
          the latest versions. <strong>Note</strong> that for major breaking
          updates, the interaction of an admin will always be required.
        </div>

        <div className="list-grid auto-updates">
          {/* Table header */}
          <span className="stateBadge" />
          <span className="name" />
          <span className="last-update header">Last auto-update</span>
          <span className="header">Enabled</span>

          <hr />
          {/* Items of the table */}
          {dnpsToShow.map(({ id, displayName, enabled, feedback }) => {
            const isSinglePackage =
              id !== MY_PACKAGES && id !== SYSTEM_PACKAGES;
            const realName = id === SYSTEM_PACKAGES ? coreName : id;

            const isInstalling = progressLogs[realName];
            const { updated, manuallyUpdated, inQueue, scheduled } = feedback;

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
                    feedbackText
                  )}
                </span>

                <Switch
                  checked={enabled ? true : false}
                  onToggle={() => setUpdateSettings(id, !Boolean(enabled))}
                />

                <hr />
              </React.Fragment>
            );
          })}
        </div>
      </Card>
    </>
  );
}

AutoUpdates.propTypes = {
  autoUpdateData: PropTypes.object.isRequired,
  progressLogs: PropTypes.object.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  autoUpdateData: getAutoUpdateData,
  progressLogs: getIsInstallingLogs
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);
