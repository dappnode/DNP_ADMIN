import * as actions from "./actions";
import * as selectors from "./selectors";
import { mountPoint } from "./data";

export { reducer } from "./reducer";

/**
 * Service > isInstallingLogs
 *
 * Keeps track of isInstallingLogs. They are use to:
 * - Flag DNPs as installing, to prevent double installations
 * - Get installation updates from the DAPPMANAGER to be shown in the UI
 *
 * [Tested]
 */

export default {
  mountPoint,
  actions,
  selectors
};
