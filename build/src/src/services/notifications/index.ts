import * as actions from "./actions";
import * as selectors from "./selectors";
import saga from "./sagas";
import { mountPoint } from "./data";

// Service > notifications

export { reducer } from "./reducer";

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
  actions,
  selectors,
  saga
};
