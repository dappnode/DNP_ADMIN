import * as selectors from "./selectors";
import { mountPoint } from "./data";

export { reducer } from "./reducer";

/**
 * Service > dnpRequest
 *
 * Requests single DNPs to the DAPPMANAGER.
 * It holds the manifest, avatar, lastest version, etc of all DNPs
 * that may be fetched during the session.
 *
 * Used across multiple pages and services
 *
 * [Not-Tested]
 */

export default {
  mountPoint,
  selectors
};
