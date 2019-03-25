import { put, call, delay } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";

// Service > chainData

function* requestChainData() {
  try {
    yield call(APIcall.requestChainData);
    yield delay(5 * 60 * 1000);
    yield put(a.requestChainData);
  } catch (e) {
    console.error(`Error on requestChainData: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  ["CONNECTION_OPEN", requestChainData],
  [t.REQUEST_CHAIN_DATA, requestChainData]
]);
