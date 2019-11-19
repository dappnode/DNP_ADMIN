import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

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
  reducer,
  saga
};
