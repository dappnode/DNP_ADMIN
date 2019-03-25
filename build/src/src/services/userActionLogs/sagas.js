import { put, call } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";

export function* fetchUserActionLogs() {
  try {
    const userActionLogsString = yield call(APIcall.getUserActionLogs);
    // fetchDirectory CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: logs <string>

    // Process userActionLogs. They are json objects appended in a log file
    let userActionLogs = [];
    userActionLogsString
      .trim()
      .split(/\r?\n/)
      .forEach((stringifiedLog, i) => {
        try {
          userActionLogs.push(JSON.parse(stringifiedLog));
        } catch (e) {
          console.error(
            `Error parsing userActionLog #${i}: ${e.message}. StringifiedLog: `,
            stringifiedLog
          );
        }
      });

    // Collapse equal errors
    for (let i = 0; i < userActionLogs.length; i++) {
      const log = userActionLogs[i];
      const logNext = userActionLogs[i + 1];
      if (log && logNext) {
        if (
          log.level === logNext.level &&
          log.event === logNext.event &&
          log.message === logNext.message &&
          log.stack === logNext.stack
        ) {
          log.count ? log.count++ : (log.count = 2);
          userActionLogs.splice(i + 1, 1);
          // Go one step back to keep aggregating on the same index
          i--;
        }
      }
    }

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
  ["CONNECTION_OPEN", fetchUserActionLogs],
  [t.FETCH_USER_ACTION_LOGS, fetchUserActionLogs]
];

export default rootWatcher(watchers);
