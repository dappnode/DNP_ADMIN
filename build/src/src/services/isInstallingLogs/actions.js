import * as t from "./actionTypes";

// Service > isInstallingLogs

/**
 * [Tested]
 */

export const updateIsInstallingLog = (dnpName, log, id) => ({
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

// Util

const stripVersion = s => (s || "").split("@")[0];
