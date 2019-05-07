import { mountPoint } from "./data";
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
        from: (dnp || {}).version,
        to: (manifest || {}).version,
        manifest
      };
    });
  }
);

export const getCoreManifest = createSelector(
  getLocalState,
  localState => localState.coreManifest
);
export const getCoreUpdateAvailable = createSelector(
  getCoreDeps,
  coreDeps => Boolean(coreDeps.length)
);
