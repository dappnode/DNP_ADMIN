import { put, call } from "redux-saga/effects";
import { api } from "api";
import { CONNECTION_OPEN } from "services/connectionStatus";
import { rootWatcher } from "utils/redux";
import { updateStatus, setDnpInstalled } from "./actions";

// Service > dnpInstalled

function* fetchDnpInstalled() {
  try {
    yield put(updateStatus({ loading: true }));
    const dnpInstalled = yield call(api.listPackages);
    yield put(setDnpInstalled(dnpInstalled));
    yield put(updateStatus({ loading: false, success: true }));
  } catch (e) {
    yield put(updateStatus({ loading: false, error: e.message }));
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([[CONNECTION_OPEN, fetchDnpInstalled]]);
