import { put, call } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";

// Service > devices

export function* fetchDevices() {
  try {
    yield put({ type: "#####UPDATE_FETCHING", fetching: true });
    const devices = yield call(api.listDevices, {}, { toastOnError: true });
    yield put({ type: "#####UPDATE_FETCHING", fetching: false });
    yield put(a.updateDevices(devices));
  } catch (e) {
    console.error(`Error on fetchDevices: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  ["CONNECTION_OPEN", fetchDevices],
  [t.FETCH_DEVICES, fetchDevices]
]);
