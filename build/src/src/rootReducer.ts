import { combineReducers } from "redux";

// Reducers
import { reducer as chainData } from "services/chainData/reducer";
import { reducer as connectionStatus } from "services/connectionStatus/reducer";
import { reducer as coreUpdate } from "services/coreUpdate/reducer";
import { reducer as dappnodeStatus } from "services/dappnodeStatus/reducer";
import { reducer as dnpDirectory } from "services/dnpDirectory/reducer";
import { reducer as dnpInstalled } from "services/dnpInstalled/reducer";
import { reducer as isInstallingLogs } from "services/isInstallingLogs/reducer";
import { reducer as notifications } from "services/notifications/reducer";
import { reducer as userActionLogs } from "services/userActionLogs/reducer";

export const rootReducer = combineReducers({
  chainData,
  connectionStatus,
  coreUpdate,
  dappnodeStatus,
  dnpDirectory,
  dnpInstalled,
  isInstallingLogs,
  notifications,
  userActionLogs
});

export type RootState = ReturnType<typeof rootReducer>;
