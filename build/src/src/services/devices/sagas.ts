import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "API/start";
import * as a from "./actions";
import { loadingId } from "./data";
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";

// Service > devices

export function* fetchDevices() {
  try {
    yield put(updateIsLoading(loadingId));
    const devices = yield call(api.devicesList);
    yield put(a.updateDevices(devices));
    yield put(updateIsLoaded(loadingId));
  } catch (e) {
    console.error(`Error on fetchDevices: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([[CONNECTION_OPEN, fetchDevices]]);
