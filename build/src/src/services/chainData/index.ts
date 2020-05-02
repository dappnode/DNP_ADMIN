export * as actions from "./actions";
export * as selectors from "./selectors";
export * as types from "./types";
import saga from "./sagas";
export { mountPoint } from "./data";

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
  saga,
};
