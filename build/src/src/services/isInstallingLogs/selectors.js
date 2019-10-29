import { mountPoint } from "./data";
import { createSelector } from "reselect";
import { stripVersion } from "./utils";

// Service > isInstallingLogs

export const getIsInstallingLogs = createSelector(
  state => state[mountPoint],
  isInstallingLogs => isInstallingLogs
);

/**
 * Returns true if the DNP is being installed
 *
 * @param {string} id: "ln.dnp.dappnode.eth"
 * @returns {Boolean}
 * [Tested]
 */
export const getIsInstallingByDnp = createSelector(
  getIsInstallingLogs,
  (_, dnpName) => stripVersion(dnpName),
  (isInstallingLogs, dnpName) => Boolean(isInstallingLogs[dnpName])
);

/**
 * Gets the progressLogs of an installation id
 *
 * @param {string} id: "ln.dnp.dappnode.eth"
 * @returns {object} progressLogs = {
 *   "bitcoin.dnp.dappnode.eth": "Loading...",
 *   "ln.dnp.dappnode.eth": "Downloading 46%"
 * }
 * [Tested]
 */
export const getProgressLogsById = createSelector(
  getIsInstallingLogs,
  (_, id) => stripVersion(id),
  (isInstallingLogs, id) => gatherLogsById(isInstallingLogs, id)
);

/**
 * Gets the progressLogs of an installation id, given a DNP
 * [NOTE]: This selector is compatible with both types of logId:
 * - Old: logId = "834d5e59-664b-46b9-8906-fbc5341d1acf"
 * - New: logId = "ln.dnp.dappnode.eth"
 *
 * @param {string} dnpName: "bitcoin.dnp.dappnode.eth"
 * @returns {object} progressLogs = {
 *   "bitcoin.dnp.dappnode.eth": "Loading...",
 *   "ln.dnp.dappnode.eth": "Downloading 46%"
 * }
 * [Tested]
 */
export const getProgressLogsByDnp =
  (getIsInstallingLogs,
  (_, dnpName) => stripVersion(dnpName),
  (isInstallingLogs, dnpName) => {
    const id = (isInstallingLogs[dnpName] || {}).id;
    return id ? gatherLogsById(isInstallingLogs, id) : {};
  });

// Utilitiy

/**
 * Same as getProgressLogsById
 * @param {object} logs
 * @param {string} id
 */
function gatherLogsById(logs, id) {
  return Object.entries(logs).reduce((obj, [dnpName, log]) => {
    if (log.id === id) obj[dnpName] = log.log;
    return obj;
  }, {});
}
