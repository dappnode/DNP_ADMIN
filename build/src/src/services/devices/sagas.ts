import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
import * as a from "./actions";
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import * as loadingIds from "services/loadingStatus/loadingIds";
import { CONNECTION_OPEN } from "services/connectionStatus";

// Service > devices

export function* fetchDevices() {
  try {
    yield put(updateIsLoading(loadingIds.devices));
    const devices = yield call(api.devicesList);
    yield put(a.updateDevices(devices));
    yield put(updateIsLoaded(loadingIds.devices));
  } catch (e) {
    console.error(`Error on fetchDevices: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([[CONNECTION_OPEN, fetchDevices]]);
