import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
import * as a from "./actions";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
import { FETCH_USER_ACTION_LOGS } from "./types";
import { parseUserActionLogsString } from "utils/parseUserActionLogsString";

/**
 * [Tested]
 */
export function* fetchUserActionLogs() {
  try {
    const userActionLogsString: string = yield call(api.getUserActionLogs, {});
    const userActionLogs = parseUserActionLogsString(userActionLogsString);

    // Update userActionLogs
    yield put(a.updateUserActionLogs(userActionLogs));
  } catch (error) {
    console.error("Error fetching userActionLogs: ", error);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [CONNECTION_OPEN, fetchUserActionLogs],
  [FETCH_USER_ACTION_LOGS, fetchUserActionLogs]
];

export default rootWatcher(watchers);
