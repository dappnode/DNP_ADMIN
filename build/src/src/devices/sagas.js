import { call, put, takeEvery, all } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher"
import * as APIcall from "API/rpcMethods";
import t from "./actionTypes";
import Toast from "components/Toast";

/***************************** Subroutines ************************************/

export function* fetchDevices() {
  try {
    yield put({ type: t.UPDATE_FETCHING, fetching: true });
    const res = yield call(APIcall.fetchDevices);
    yield put({ type: t.UPDATE_FETCHING, fetching: false });

    if (res.success) {
      yield put({ type: "UPDATE_DEVICES", devices: res.result });
    } else {
      new Toast(res);
    }
  } catch (error) {
    console.error("Error listing devices: ", error);
  }
}

function* callApi({ method, kwargs, message }) {
  try {
    const pendingToast = new Toast({ message, pending: true });
    const res = yield call(APIcall[method], kwargs);
    pendingToast.resolve(res);
  } catch (error) {
    console.error("Error on " + method + ": ", error);
  }
  yield call(fetchDevices);
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  ["CONNECTION_OPEN"]: fetchDevices,
  ["FETCH_DEVICES"]: fetchDevices,
  [t.CALL]: callApi
}

export default rootWatcher(watchers)
