import { mountPoint, coreName } from "./data";
import { createSelector } from "reselect";
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
export const getCoreUpdateData = createSelector(
  getLocalState,
  localState => localState.coreUpdateData
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
  getCoreUpdateData,
  coreUpdateData => {
    const corePackages = coreUpdateData.packages || [];
    const coreDeps = corePackages.filter(
      dnp => !(dnp.name || "").includes("core")
    );
    if (coreDeps.length) return coreDeps;

    const coreDnp = corePackages.find(dnp => (dnp.name || "").includes("core"));
    if (coreDnp) return [coreDnp];

    return [];
  }
);

/**
 * Appends property `updateType` to the manifest
 * updateType = "major, minor, patch"
 */
export const getCoreManifest = createSelector(
  getCoreUpdateData,
  coreUpdateData => {
    const dnpCore = (coreUpdateData.packages || []).find(dnp =>
      (dnp.name || "").includes("core")
    );
    return (dnpCore || {}).manifest;
  }
);

/**
 * Gets the core update message, computing the current update jump
 */
export const getCoreUpdateAlerts = createSelector(
  getCoreUpdateData,
  coreUpdateData => coreUpdateData.updateAlerts || []
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
  getCoreUpdateData,
  coreUpdateData => Boolean(coreUpdateData.available)
);

export const getIsCoreUpdateTypePatch = createSelector(
  getCoreUpdateData,
  coreUpdateData => coreUpdateData.type === "patch"
);
