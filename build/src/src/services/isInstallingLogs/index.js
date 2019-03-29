import * as actionTypes from "./actionTypes";
import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import { mountPoint } from "./data";

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
  actionTypes,
  actions,
  selectors,
  reducer
};
