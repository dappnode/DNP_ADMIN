import { put, call, select } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import * as s from "./selectors";

// #### TODO
function updateFetching(topic, fetching) {
  return { type: "UPDATE_FETCHING", topic, fetching };
}

// Service > notifications

function* fetchNotifications() {
  try {
    yield put(updateFetching("notifications", true));
    // > result: notifications =
    //   {
    //       "notificiation-id": {
    //          id: 'diskSpaceRanOut-stoppedPackages',
    //          type: 'error',
    //          title: 'Disk space ran out, stopped packages',
    //          body: `Available disk space is less than a safe ...`,
    //       },
    //       ...
    //   }
    const notifications = yield call(APIcall.notificationsGet);
    yield put(updateFetching("notifications", false));
    console.log("Initial notifications", notifications);
    for (const notification of Object.values(notifications)) {
      yield put(a.pushNotificationFromDappmanager(notification));
    }
  } catch (e) {
    console.error(`Error on fetchNotifications: ${e.stack}`);
  }
}

function* removeDappmanagerNotifications() {
  try {
    // Load notifications
    const notifications = yield select(s.getNotifications);
    // Check the ones that came from the dappmanager
    const ids = notifications
      .filter(notification => notification.fromDappmanager)
      .map(notification => notification.id);
    if (ids.length) {
      // Send the ids to the dappmanager
      yield call(APIcall.notificationsRemove, { ids });
      // Update the seen status so they are not sent again
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
  ["CONNECTION_OPEN", fetchNotifications],
  [t.FETCH_NOTIFICATIONS, fetchNotifications],
  [t.VIEWED_NOTIFICATIONS, removeDappmanagerNotifications]
];

export default rootWatcher(watchers);
