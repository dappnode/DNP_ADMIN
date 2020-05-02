import * as actionTypes from "./types";
import * as actions from "./actions";
import * as selectors from "./selectors";
import saga from "./sagas";
import { mountPoint } from "./data";

export { reducer } from "./reducer";

/**
 * Service > dappnodeStatus
 *
 * Requests system or status data from the DAPPMANAGER.
 */

export default {
  mountPoint,
  actionTypes,
  actions,
  selectors,
  saga
};
