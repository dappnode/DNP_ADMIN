import { put, call } from "redux-saga/effects";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import * as loadingIds from "services/loadingStatus/loadingIds";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
// Utils

import { rootWatcher } from "utils/redux";

// Service > dnpInstalled

function* fetchDnpInstalled() {
  try {
    yield put(updateIsLoading(loadingIds.dnpInstalled));
    const dnps = yield call(api.listPackages, {}, { toastOnError: true });
    yield put(a.updateDnpInstalled(dnps));
    yield put(updateIsLoaded(loadingIds.dnpInstalled));
  } catch (e) {
    console.error(`Error on fetchDnpInstalled: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  [CONNECTION_OPEN, fetchDnpInstalled],
  [t.FETCH_DNP_INSTALLED, fetchDnpInstalled]
]);
