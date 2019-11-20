import { stripVersion } from "./utils";
import {
  UpdateIsInstallingLog,
  ClearIsInstallingLog,
  UPDATE_IS_INSTALLING_LOG,
  CLEAR_IS_INSTALLING_LOG
} from "./types";

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
export function updateIsInstallingLog({
  id,
  dnpName,
  log
}: {
  id: string;
  dnpName: string;
  log: string;
}): UpdateIsInstallingLog {
  return {
    type: UPDATE_IS_INSTALLING_LOG,
    id: stripVersion(id),
    dnpName: stripVersion(dnpName),
    log
  };
}

export function clearIsInstallingLog({
  id
}: {
  id: string;
}): ClearIsInstallingLog {
  return {
    type: CLEAR_IS_INSTALLING_LOG,
    id: stripVersion(id)
  };
}
