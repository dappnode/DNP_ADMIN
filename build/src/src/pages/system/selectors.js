// PACKAGES
import { mountPoint } from "./data";
import { createSelector } from "reselect";
// Modules
import { getProgressLogs } from "pages/installer/selectors";

// #### INTERNAL
const getLocalState = createSelector(
  state => state[mountPoint],
  localState => localState
);

export const coreDeps = createSelector(
  getLocalState,
  localState => localState.coreDeps
);
export const coreManifest = createSelector(
  getLocalState,
  localState => localState.coreManifest
);
export const systemUpdateAvailable = createSelector(
  coreDeps,
  _coreDeps => Boolean(_coreDeps.length)
);

// Find progressLog of the core DNP
export const getCoreProgressLog = createSelector(
  getProgressLogs,
  progressLogs => {
    const coreDnpName = "core.dnp.dappnode.eth";
    for (const logId of Object.keys(progressLogs || {})) {
      if (Object.keys(progressLogs[logId]).includes(coreDnpName)) {
        return progressLogs[logId];
      }
    }
  }
);
