import * as actionTypes from "./actionTypes";
import * as actions from "./actions";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

/**
 * Service > dnpDirectory
 *
 * Requests dnpDirectory to the DAPPMANAGER.
 * It holds the manifest, avatar, lastest version, etc of all DNPs
 * that may be fetched during the session. This includes:
 * - The whitelisted directory of DNPs
 * - Any DNPs that the user may search for
 * Used across multiple pages and services
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
