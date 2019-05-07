import * as actionTypes from "./actionTypes";
import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

/**
 * Service > userActionLogs
 *
 * Requests user action logs to the DAPPMANAGER.
 * Shown in the Activity page
 *
 * [Tested]
 */

export default {
  mountPoint,
  actionTypes,
  actions,
  selectors,
  reducer,
  saga
};
