import { call, put } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import t from "./actionTypes";
import Toast from "components/Toast";

/***************************** Subroutines ************************************/

export function* getDeviceCredentials({id}) {
  try {
    const res = yield call(APIcall.getDeviceCredentials, {id});
    if (res.success) {
      yield put({ type: t.UPDATE_DEVICE, id, data: res.result });
    } else {
      new Toast(res);
    }
  } catch (e) {
    console.error("Error listing devices: ", e);
  }
}

export function* listDevices() {
  try {
    yield put({ type: t.UPDATE_FETCHING, fetching: true });
    const res = yield call(APIcall.listDevices);
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
  yield call(listDevices);
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  ["CONNECTION_OPEN", listDevices],
  [t.GET_DEVICE_CREDENTIALS, getDeviceCredentials],
  ["LIST_DEVICES", listDevices],
  [t.CALL, callApi]
];

export default rootWatcher(watchers);
