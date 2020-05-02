import * as actions from "./actions";
import * as selectors from "./selectors";
import saga from "./sagas";
import { mountPoint } from "./data";

export { reducer } from "./reducer";

/**
 * Service > coreUpdate
 *
 * Requests the DNP data of the core DNP to the DAPPMANAGER.
 * Then computes given the current versions if an update has to happen
 *
 */

export default {
  mountPoint,
  actions,
  selectors,
  saga
};
