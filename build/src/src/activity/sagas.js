// DASHBOARD
import { call, put } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import t from "./actionTypes";

/***************************** Subroutines ************************************/

// For installer: throttle(ms, pattern, saga, ...args)

export function* getUserActionLogs() {
  try {
    const res = yield call(APIcall.getUserActionLogs);
    // fetchDirectory CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: logs <string>

    // Abort on error
    if (!res.success) {
      return console.error("Error fetching userActionLogs", res.message);
    }

    // Process userActionLogs. They are json objects appended in a log file
    let userActionLogs = [];
    res.result
      .trim()
      .split("\n")
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
    yield put({ type: t.UPDATE_USERACTIONLOGS, userActionLogs });
  } catch (error) {
    console.error("Error fetching userActionLogs: ", error);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  //
  ["CONNECTION_OPEN", getUserActionLogs]
];

export default rootWatcher(watchers);
