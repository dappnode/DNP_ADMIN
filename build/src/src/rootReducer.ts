import { combineReducers } from "redux";
// For injecting mock data
import reduceReducers from "reduce-reducers";
import merge from "deepmerge";

// Reducers
import chainData from "services/chainData/reducer";
import connectionStatus from "services/connectionStatus/reducer";
import coreUpdate from "services/coreUpdate/reducer";
import dappnodeStatus from "services/dappnodeStatus/reducer";
import devices from "services/devices/reducer";
import dnpDirectory from "services/dnpDirectory/reducer";
import dnpInstalled from "services/dnpInstalled/reducer";
import dnpRequest from "services/dnpRequest/reducer";
import isInstallingLogs from "services/isInstallingLogs/reducer";
import loadingStatus from "services/loadingStatus/reducer";
import notifications from "services/notifications/reducer";
import userActionLogs from "services/userActionLogs/reducer";

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
