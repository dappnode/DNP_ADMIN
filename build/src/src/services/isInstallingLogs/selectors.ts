import { mapValues, pickBy } from "lodash";
import { mountPoint } from "./data";
import { IsInstallingLogsState } from "./types";
import { ProgressLogsByDnp } from "types";

// Service > isInstallingLogs

const getLocal = (state: any): IsInstallingLogsState => state[mountPoint];

/**
 * Returns a ready-to-be-queried data structure to know by dnpName if:
 * - Is it installing? `Boolean(progressLogsByDnp[dnpName])`
 * - ProgressLogs by dnpName? `progressLogsByDnp[dnpName]`
 */
export const getProgressLogsByDnp = (state: any): ProgressLogsByDnp => {
  const isInstallingLogs = getLocal(state);
  return pickBy(
    mapValues(isInstallingLogs.dnpNameToLogId, id => isInstallingLogs.logs[id]),
    progressLogs => progressLogs
  );
};
