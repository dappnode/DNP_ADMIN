import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import semver from "semver";
import api from "API/rpcMethods";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Switch from "components/Switch";
// Utils
import { shortNameCapitalized } from "utils/format";
import { parseStaticDate, parseDiffDates } from "utils/dates";
// External
import {
  getAutoUpdateSettings,
  getAutoUpdateRegistry
} from "services/dappnodeStatus/selectors";
import { fetchAutoUpdateSettings } from "services/dappnodeStatus/actions";
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import { getIsInstallingLogs } from "services/isInstallingLogs/selectors";
import { coreName } from "services/coreUpdate/data";
import { autoUpdateIds } from "services/dappnodeStatus/data";
// Styles
import "./autoUpdates.scss";

const { MY_PACKAGES, SYSTEM_PACKAGES } = autoUpdateIds;

function AutoUpdates({
  autoUpdateRegistry,
  autoUpdateSettings,
  dnpInstalled,
  progressLogs,
  fetchAutoUpdateSettings
}) {
  const updatableIds = [
    SYSTEM_PACKAGES,
    MY_PACKAGES,
    ...(autoUpdateSettings[MY_PACKAGES]
      ? dnpInstalled
          .filter(
            dnp =>
              dnp.name &&
              // Ignore core DNPs
              dnp.isDnp &&
              // Ignore wierd versions
              semver.valid(dnp.version) &&
              // MUST come from the APM
              !dnp.origin
          )
          .map(dnp => dnp.name)
          .sort()
      : [])
  ];

  // Force a re-render every 15 seconds for the timeFrom to show up correctly
  const [, setClock] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setClock(n => n + 1), 15 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function setUpdateSettings(id, enabled) {
    api
      .autoUpdateSettingsEdit(
        { id, enabled },
        {
          toastMessage: `${
            enabled ? "Enabling" : "Disabling"
          } auto updates for ${shortNameCapitalized(id)}...`
        }
      )
      .then(() => fetchAutoUpdateSettings())
      .catch(console.error);
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
          {updatableIds.map(id => {
            const isSinglePackage =
              id !== MY_PACKAGES && id !== SYSTEM_PACKAGES;
            const enabled = isSinglePackage
              ? autoUpdateSettings[MY_PACKAGES] &&
                !autoUpdateSettings[MY_PACKAGES][id]
              : autoUpdateSettings[id];

            const realName = id === SYSTEM_PACKAGES ? coreName : id;

            /**
             * @returns {object} registry = {
             *   "bitcoin.dnp.dappnode.eth": {
             *     "0.1.1": { firstSeen: 1563218436285, updated: 1563304834738, completedDelay: true },
             *     "0.1.2": { firstSeen: 1563371560487 }
             *   }, ...
             * }
             */

            const versions = autoUpdateRegistry[realName] || {};
            const latestVersion = semver.maxSatisfying(
              Object.keys(versions).filter(semver.valid),
              "*"
            );
            const { firstSeen, scheduledUpdate, updated } =
              versions[latestVersion] || {};

            const dnp = dnpInstalled.find(dnp => dnp.name === realName);
            const currentVersion = (dnp || {}).version;

            // In queue means that the scheduled time has passed,
            // but likely the interval has not happened yet or the installation errored
            const inQueue = firstSeen ? Date.now() > scheduledUpdate : false;
            const manuallyUpdated =
              currentVersion &&
              currentVersion === latestVersion &&
              scheduledUpdate &&
              !updated;

            const isInstalling = progressLogs[realName];

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
                  {shortNameCapitalized(id)}
                </span>

                <span className="last-update">
                  {isInstalling
                    ? "Updating..."
                    : manuallyUpdated
                    ? "Manually updated"
                    : updated
                    ? parseStaticDate(updated)
                    : inQueue
                    ? "In queue..."
                    : scheduledUpdate
                    ? `Scheduled, in ${parseDiffDates(scheduledUpdate)}`
                    : "-"}
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
  autoUpdateRegistry: PropTypes.object.isRequired,
  autoUpdateSettings: PropTypes.object.isRequired,
  dnpInstalled: PropTypes.array.isRequired,
  progressLogs: PropTypes.object.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  autoUpdateRegistry: getAutoUpdateRegistry,
  autoUpdateSettings: getAutoUpdateSettings,
  dnpInstalled: getDnpInstalled,
  progressLogs: getIsInstallingLogs
});

const mapDispatchToProps = {
  fetchAutoUpdateSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoUpdates);
