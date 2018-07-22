import { call, put, takeEvery, all } from "redux-saga/effects";
import * as APIcall from "API/crossbarCalls";
import * as t from "./actionTypes";

/***************************** Subroutines ************************************/

export function* fetchDevices() {
  try {
    const devices = yield call(APIcall.fetchDevices);
    yield put({ type: t.UPDATE, devices });
  } catch (error) {
    console.error("Error listing devices: ", error);
  }
}

function* callApi(action) {
  try {
    yield call(APIcall[action.call], { id: action.id });
  } catch (error) {
    console.error("Error on " + action.call + ": ", error);
  }
  yield call(fetchDevices);
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchFetchDevices() {
  yield takeEvery(t.FETCH_DEVICES, fetchDevices);
}

function* watchCall() {
  yield takeEvery(t.CALL, callApi);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchFetchDevices(), watchCall()]);
}
