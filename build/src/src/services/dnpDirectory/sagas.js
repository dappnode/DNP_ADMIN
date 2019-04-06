import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import { loadingId } from "./data";
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";

// Service > dnpDirectory

function* fetchDnpDirectory() {
  try {
    yield put(updateIsLoading(loadingId));
    const dnps = yield call(APIcall.fetchDirectory, { toastOnError: true });
    yield put(a.updateDnpDirectory(dnps));
    yield put(updateIsLoaded(loadingId));
  } catch (e) {
    console.error(`Error on fetchDnpDirectory: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  [CONNECTION_OPEN, fetchDnpDirectory],
  [t.FETCH_DNP_DIRECTORY, fetchDnpDirectory]
]);
