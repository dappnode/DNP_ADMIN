import * as actionTypes from "./actionTypes";
import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

// Service > notifications

/**
 * Service > chainData
 *
 * Requests chainData to the DAPPMANAGER.
 * Shown in the TopBar and in the Dashboard pages
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
