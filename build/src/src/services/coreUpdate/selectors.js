import { mountPoint, coreName } from "./data";
import { createSelector } from "reselect";
import semver from "semver";
// Selectors
import { getDnpInstalled } from "services/dnpInstalled/selectors";

// Service > coreUpdate

const getLocalState = createSelector(
  state => state[mountPoint],
  localState => localState
);

export const getUpdatingCore = createSelector(
  getLocalState,
  localState => localState.updatingCore
);

/**
 * @returns {array} = [{
 *   name: "admin.dnp.dappnode.eth",
 *   from: "0.1.2",
 *   to: "0.1.3",
 *   manifest: <manifestObject>
 * }, ... ]
 */
export const getCoreDeps = createSelector(
  getLocalState,
  getDnpInstalled,
  (localState, dnpInstalled) => {
    const { coreDeps } = localState;
    return Object.entries(coreDeps).map(([name, manifest]) => {
      const dnp = dnpInstalled.find(_dnp => _dnp.name === name);
      return {
        name,
        from: (dnp || {}).version || "",
        to: (manifest || {}).version,
        manifest
      };
    });
  }
);

/**
 * Appends property `updateType` to the manifest
 * updateType = "major, minor, patch"
 */
export const getCoreManifest = createSelector(
  getLocalState,
  localState => localState.coreManifest
);

/**
 * Gets the core update message, computing the current update jump
 */
export const getCoreUpdateAlerts = createSelector(
  getCoreManifest,
  getDnpInstalled,
  (coreManifest, dnpInstalled) => {
    const dnpCore = dnpInstalled.find(dnp => dnp.name === coreName);
    const from = (dnpCore || {}).version;
    const to = (coreManifest || {}).version;
    const { updateAlerts = [] } = coreManifest || {};
    return updateAlerts.filter(
      updateAlert =>
        updateAlert.message &&
        updateAlert.from &&
        semver.satisfies(from, updateAlert.from) &&
        semver.satisfies(to, updateAlert.to || "*")
    );
  }
);

/**
 * Gets the core current version
 */
export const getCoreCurrentVersion = createSelector(
  getDnpInstalled,
  dnpInstalled => {
    const dnpCore = dnpInstalled.find(dnp => dnp.name === coreName);
    return (dnpCore || {}).version;
  }
);

export const getCoreUpdateAvailable = createSelector(
  getCoreDeps,
  coreDeps => Boolean(coreDeps.length)
);
