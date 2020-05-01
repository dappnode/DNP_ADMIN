import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
import * as a from "./actions";
import * as t from "./actionTypes";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
import { UserActionLog } from "common/types";

interface UserActionLogWithCount extends UserActionLog {
  count?: number;
  timestamp: number;
}

/**
 * [Tested]
 */
export function* fetchUserActionLogs() {
  try {
    const userActionLogsString = yield call(api.getUserActionLogs, {});
    // fetchDirectory CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: logs <string>
    // Which contain objects with
    // log = {
    //   event: "installPackage.dappmanager.dnp.dappnode.eth",
    //   kwargs: {
    //     id: "rinkeby.dnp.dappnode.eth",
    //     userSetVols: {},
    //     userSetPorts: {},
    //     options: {}
    //   },
    //   level: "error",
    //   message: "Timeout to cancel expired",
    //   name: "Error",
    //   stack: "Error: Timeout to cancel expired↵  ...",
    //   timestamp: "2019-02-01T19:09:16.503Z"
    // };

    if (typeof userActionLogsString !== "string")
      return console.warn(
        "userActionLogsString must be a string, userActionLogsString:",
        userActionLogsString
      );

    // Process userActionLogs. They are json objects appended in a log file
    let userActionLogs: UserActionLogWithCount[] = [];
    userActionLogsString
      .trim()
      .split(/\r?\n/)
      .filter(s => s.trim())
      .forEach((stringifiedLog, i) => {
        try {
          userActionLogs.push(JSON.parse(stringifiedLog));
        } catch (e) {
          console.warn(
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

    // Order by newest first
    const userActionLogsSorted = userActionLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Update userActionLogs
    yield put(a.updateUserActionLogs(userActionLogsSorted));
  } catch (error) {
    console.error("Error fetching userActionLogs: ", error);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [CONNECTION_OPEN, fetchUserActionLogs],
  [t.FETCH_USER_ACTION_LOGS, fetchUserActionLogs]
];

export default rootWatcher(watchers);
