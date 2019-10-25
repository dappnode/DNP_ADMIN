import * as t from "./actionTypes";
import { stripVersion } from "./utils";

// Service > isInstallingLogs

/**
 * [Tested]
 */

/**
 * [Note]: The arguments MUST be kwargs, because there are too many
 * and there is risk of confusing the order
 *
 * @param id: Reference id that bundles all the logs of this process
 * @param dnpName: Specific DNP name to which this log belongs to
 * @param log: "Downloading 45%"
 */
export const updateIsInstallingLog = ({ id, dnpName, log }) => ({
  type: t.UPDATE_IS_INSTALLING_LOG,
  dnpName: stripVersion(dnpName),
  log,
  id: stripVersion(id)
});

export const clearIsInstallingLog = dnpName => ({
  type: t.CLEAR_IS_INSTALLING_LOG,
  dnpName: stripVersion(dnpName)
});

export const clearIsInstallingLogsById = id => ({
  type: t.CLEAR_IS_INSTALLING_LOGS_OF_ID,
  id: stripVersion(id)
});

export const clearAllIsInstallingLogs = () => ({
  type: t.CLEAR_ALL_IS_INSTALLING_LOGS
});
