import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

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
  reducer,
  saga
};
