import { put, takeEvery, all, call, select, take } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher"
import * as APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as s from "./selectors";
import * as t from "./actionTypes";

function* getDappnodeStats() {
  try {
    // If connection is not open yet, wait for it to open.
    const connectionOpen = yield select(s.connectionOpen);
    if (!connectionOpen) {
      yield take("CONNECTION_OPEN");
    }
    const res = yield call(APIcall.getStats);
    if (res.success) {
      const stats = res.result || {};
      yield put(a.updateDappnodeStats({ stats }));
    }
  } catch (e) {
    console.error("Error getting dappnode stats");
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  [t.GET_DAPPNODE_STATS]: getDappnodeStats,
}

export default rootWatcher(watchers)
