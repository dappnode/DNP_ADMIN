import { call, put, takeEvery, all } from "redux-saga/effects";
import * as APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import Toast from "components/Toast";

/***************************** Subroutines ************************************/

export function* fetchDevices() {
  try {
    const res = yield call(APIcall.fetchDevices);
    if (res.success) {
      yield put({ type: t.UPDATE, devices: res.result });
    } else {
      new Toast(res);
    }
  } catch (error) {
    console.error("Error listing devices: ", error);
  }
}

function* callApi({ method, id, message }) {
  try {
    const pendingToast = new Toast({ message, pending: true });
    const res = yield call(APIcall[method], { id });
    pendingToast.resolve(res);
  } catch (error) {
    console.error("Error on " + method + ": ", error);
  }
  yield call(fetchDevices);
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchFetchDevices() {
  yield takeEvery("CONNECTION_OPEN", fetchDevices);
}

function* watchCall() {
  yield takeEvery(t.CALL, callApi);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchFetchDevices(), watchCall()]);
}
