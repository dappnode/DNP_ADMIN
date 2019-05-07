import { put, call, select } from "redux-saga/effects";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import * as s from "./selectors";
import { loadingId } from "./data";
// Actions
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
// Utils
import { rootWatcher } from "utils/redux";

// Service > notifications

function* fetchNotifications() {
  try {
    yield put(updateIsLoading(loadingId));
    const notifications = yield call(api.notificationsGet);
    yield put(updateIsLoaded(loadingId));

    // #### Log for debuging purposes. Do it before the put in case the validators fail
    console.log("Initial notifications", notifications);

    /**
     * @param notifications = [{
     *     id: "diskSpaceRanOut-stoppedPackages",
     *     type: "danger",
     *     title: "Disk space ran out, stopped packages",
     *     body: "Available disk space is less than a safe ...",
     *   }, ... ]
     */

    for (const notification of notifications) {
      yield put(a.pushNotificationFromDappmanager(notification));
    }
  } catch (e) {
    console.error(`Error on fetchNotifications: ${e.stack}`);
  }
}

/**
 * Side-effect to tell the DAPPMANAGER to mark its notifications as viewed
 */
export function* removeDappmanagerNotifications() {
  try {
    // Load notifications
    const notifications = yield select(s.getNotifications);
    // Check the ones that came from the dappmanager
    const ids = Object.values(notifications)
      .filter(notification => notification.fromDappmanager)
      .map(notification => notification.id);
    if (ids.length) {
      // Send the ids to the dappmanager
      yield call(api.notificationsRemove, { ids });
      // If call is successful, update the seen status so they are not sent again
      yield put(a.removeDappmanagerNotifications());
    }
  } catch (e) {
    console.error(`Èrror on removeDappmanagerNotifications: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [CONNECTION_OPEN, fetchNotifications],
  [t.FETCH_NOTIFICATIONS, fetchNotifications],
  [t.VIEWED_NOTIFICATIONS, removeDappmanagerNotifications]
];

export default rootWatcher(watchers);
