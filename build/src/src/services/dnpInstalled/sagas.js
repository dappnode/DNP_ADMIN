import { put, call } from "redux-saga/effects";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import { wrapErrorsAndLoading } from "services/loadingStatus/sagas";
import * as loadingIds from "services/loadingStatus/loadingIds";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
// Utils

import { rootWatcher } from "utils/redux";

// Service > dnpInstalled

// It's okay, because all non-handled sagas are wrapped on a try/catch

const fetchDnpInstalled = wrapErrorsAndLoading(
  loadingIds.dnpInstalled,
  function*() {
    const dnps = yield call(
      api.listPackages,
      {},
      { toastOnError: true, throw: true }
    );
    yield put(a.updateDnpInstalled(dnps));
  }
);

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  [CONNECTION_OPEN, fetchDnpInstalled],
  [t.FETCH_DNP_INSTALLED, fetchDnpInstalled]
]);
