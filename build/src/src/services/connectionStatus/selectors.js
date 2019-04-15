import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > connectionStatus

/**
 * @returns {object} connectionStatus = {
 *   isOpen: false,
 *   error: "Unreachable",
 *   session: "WAMP session object",
 *   isNotAdmin: false
 * }
 */
export const getConnectionStatus = createSelector(
  state => state[mountPoint],
  connectionStatus => connectionStatus
);

/**
 * @returns {Boolean}
 * [Tested]
 */
export const getIsConnectionOpen = createSelector(
  getConnectionStatus,
  connectionStatus => connectionStatus.isOpen
);
