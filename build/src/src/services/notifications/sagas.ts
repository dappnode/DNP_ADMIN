import { put, call } from "redux-saga/effects";
import { api } from "api";
import * as a from "./actions";
import { loadingId } from "./data";
// Actions
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import { CONNECTION_OPEN } from "services/connectionStatus";
// Utils
import { rootWatcher } from "utils/redux";
import { FETCH_NOTIFICATIONS } from "./types";

// Service > notifications

function* fetchNotifications() {
  try {
    yield put(updateIsLoading(loadingId));
    const notifications = yield call(api.notificationsGet);
    yield put(updateIsLoaded(loadingId));

    // #### Log for debuging purposes. Do it before `put()` in case the validators fail
    /* eslint-disable-next-line no-console */
    console.log("Initial notifications", notifications);

    for (const notification of notifications) {
      yield put(a.pushNotification(notification));
    }
  } catch (e) {
    console.error(`Error on fetchNotifications: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [CONNECTION_OPEN, fetchNotifications],
  [FETCH_NOTIFICATIONS, fetchNotifications]
];

export default rootWatcher(watchers);
