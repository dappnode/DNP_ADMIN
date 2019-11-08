import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import { mountPoint } from "./data";
import saga from "./sagas";

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
  actions,
  selectors,
  reducer,
  saga
};
