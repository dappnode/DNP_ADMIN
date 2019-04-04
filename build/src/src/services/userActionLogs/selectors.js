import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > userActionLogs

/**
 * @param {Array} userActionLogs = [{
 *   event: "installPackage.dappmanager.dnp.dappnode.eth",
 *   kwargs: {
 *     id: "rinkeby.dnp.dappnode.eth",
 *     userSetVols: {},
 *     userSetPorts: {},
 *     options: {}
 *   },
 *   level: "error",
 *   message: "Timeout to cancel expired",
 *   name: "Error",
 *   stack: "Error: Timeout to cancel expired↵   ",
 *   timestamp: "2019-02-01T19:09:16.503Z"
 * }, ... ]
 */
export const getUserActionLogs = createSelector(
  state => state[mountPoint],
  userActionLogs => userActionLogs
);
