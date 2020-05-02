import * as actions from "./actions";
import * as selectors from "./selectors";
import saga from "./sagas";
import { mountPoint } from "./data";

export { reducer } from "./reducer";

/**
 * Service > devices
 *
 * Requests the device list to the VPN.
 * Shown in the devices page
 *
 * [Tested]
 */

export default {
  mountPoint,
  actions,
  selectors,
  saga
};
