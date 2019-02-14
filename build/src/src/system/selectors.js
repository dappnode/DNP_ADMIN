// PACKAGES
import { NAME } from "./constants";
import { createSelector } from "reselect";
// Modules
import installer from "installer";

// #### INTERNAL
const getLocalState = createSelector(
  state => state[NAME],
  localState => localState
);

export const coreDeps = createSelector(
  getLocalState,
  localState => localState.coreDeps
);
export const staticIp = createSelector(
  getLocalState,
  localState => localState.staticIp
);
export const staticIpInput = createSelector(
  getLocalState,
  localState => localState.staticIpInput
);

// Find progressLog of the core DNP
export const getCoreProgressLog = createSelector(
  installer.selectors.progressLogs,
  progressLogs => {
    const coreDnpName = "core.dnp.dappnode.eth";
    for (const logId of Object.keys(progressLogs)) {
      if (Object.keys(progressLogs[logId]).includes(coreDnpName)) {
        return progressLogs[logId];
      }
    }
  }
);
