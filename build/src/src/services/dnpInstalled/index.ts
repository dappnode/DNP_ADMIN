import * as actions from "./actions";
import * as selectors from "./selectors";
import { mountPoint } from "./data";
import saga from "./sagas";

// Service > dnpInstalled

export { reducer } from "./reducer";

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
  saga
};
