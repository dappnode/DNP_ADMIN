import * as actionTypes from "./types";
import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

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
  reducer,
  saga
};
