import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import { wrapErrorsAndLoading } from "services/loadingStatus/sagas";
import * as loadingIds from "services/loadingStatus/loadingIds";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";

// Service > dnpDirectory

// It's okay, because all non-handled sagas are wrapped on a try/catch

const fetchDnpDirectory = wrapErrorsAndLoading(
  loadingIds.dnpDirectory,
  function*() {
    const dnps = yield call(APIcall.fetchDirectory, {
      toastOnError: true,
      throw: true
    });
    yield put(a.updateDnpDirectory(dnps));
  }
);

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  [CONNECTION_OPEN, fetchDnpDirectory],
  [t.FETCH_DNP_DIRECTORY, fetchDnpDirectory]
]);
