import * as actionTypes from "./actionTypes";
import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

// Service > dnpInstalled

/**
 * Service > dnpInstalled
 *
 * Requests the installed DNPs to the DAPPMANAGER.
 * Shown in the packages and system pages, as well as used
 * in some services to compare versions
 *
 * [Partially-Tested]
 */

export default {
  mountPoint,
  actionTypes,
  actions,
  selectors,
  reducer,
  saga
};
