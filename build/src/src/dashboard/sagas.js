import { put, call } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import assertConnectionOpen from "utils/assertConnectionOpen";
import * as APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";

function* getDappnodeStats() {
  try {
    yield call(assertConnectionOpen);
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
  [t.GET_DAPPNODE_STATS]: getDappnodeStats
};

export default rootWatcher(watchers);
