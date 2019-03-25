import { put, call } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import arrayToObj from "utils/arrayToObj";

// Service > dnpDirectory

function* fetchDnpDirectory() {
  try {
    const dnps = yield call(APIcall.fetchDirectory, { toastOnError: true });
    const dnpsObject = Array.isArray(dnps)
      ? arrayToObj(dnps, dnp => dnp.name)
      : dnps;
    yield put(a.updateDnpDirectory(dnpsObject));
  } catch (e) {
    console.error(`Error on fetchDnpDirectory: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  ["CONNECTION_OPEN", fetchDnpDirectory],
  [t.FETCH_DNP_DIRECTORY, fetchDnpDirectory]
]);
