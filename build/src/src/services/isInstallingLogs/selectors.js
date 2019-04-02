import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > isInstallingLogs

const getIsInstallingLogs = createSelector(
  state => state[mountPoint],
  userActionLogs => userActionLogs
);

/**
 * Returns true if the DNP is being installed
 * @param {String} id: "ln.dnp.dappnode.eth"
 * @returns {Boolean}
 * [Tested]
 */
export const getIsInstallingByDnp = createSelector(
  getIsInstallingLogs,
  (_, dnpName) => dnpName,
  (isInstallingLogs, dnpName) => Boolean(isInstallingLogs[dnpName])
);

/**
 * Gets the progressLogs of an installation id
 * @param {String} id: "ln.dnp.dappnode.eth"
 * @returns {Object} progressLogs = {
 *   "bitcoin.dnp.dappnode.eth": "Loading...",
 *   "ln.dnp.dappnode.eth": "Downloading 46%"
 * }
 * [Tested]
 */
export const getProgressLogsById = createSelector(
  getIsInstallingLogs,
  (_, id) => id,
  (isInstallingLogs, id) => {
    const progressLogs = {};
    Object.keys(isInstallingLogs).forEach(key => {
      if (isInstallingLogs[key].id === id)
        progressLogs[key] = isInstallingLogs[key].log;
    });
    return progressLogs;
  }
);
