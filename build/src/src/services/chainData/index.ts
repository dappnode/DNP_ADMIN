import * as actions from "./actions";
import * as selectors from "./selectors";
import * as types from "./types";
import reducer from "./reducer";
import saga from "./sagas";
import { mountPoint } from "./data";

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
  reducer,
  saga,
  types
};
