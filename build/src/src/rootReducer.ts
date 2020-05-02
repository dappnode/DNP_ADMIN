import { combineReducers } from "redux";
// For injecting mock data
import reduceReducers from "reduce-reducers";
import merge from "deepmerge";

// Reducers
import { reducer as chainData } from "services/chainData/reducer";
import { reducer as connectionStatus } from "services/connectionStatus/reducer";
import { reducer as coreUpdate } from "services/coreUpdate/reducer";
import { reducer as dappnodeStatus } from "services/dappnodeStatus/reducer";
import { reducer as devices } from "services/devices/reducer";
import { reducer as dnpDirectory } from "services/dnpDirectory/reducer";
import { reducer as dnpInstalled } from "services/dnpInstalled/reducer";
import { reducer as dnpRequest } from "services/dnpRequest/reducer";
import { reducer as isInstallingLogs } from "services/isInstallingLogs/reducer";
import { reducer as loadingStatus } from "services/loadingStatus/reducer";
import { reducer as notifications } from "services/notifications/reducer";
import { reducer as userActionLogs } from "services/userActionLogs/reducer";

const rootReducer = combineReducers({
  chainData,
  connectionStatus,
  coreUpdate,
  dappnodeStatus,
  devices,
  dnpDirectory,
  dnpInstalled,
  dnpRequest,
  isInstallingLogs,
  loadingStatus,
  notifications,
  userActionLogs
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Special reducer that has access to the entire store
 * Ref: https://github.com/redux-utilities/reduce-reducers
 * - Used in index.js to replace the state with mock content
 */
const globalReducer = function(state: RootState, action: any) {
  return action.type === "DEV_ONLY_REPLACE_STATE"
    ? merge(state, action.state)
    : state;
};
export default reduceReducers(rootReducer, globalReducer);
