import { put, call } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import assertConnectionOpen from "utils/assertConnectionOpen";
import checkIpfsConnection from "./diagnoseFunctions/checkIpfsNode";

// Service > dappnodeParams

export function* fetchDappnodeParams() {
  try {
    const dappnodeParams = yield call(api.getParams);
    const statusUpnp = yield call(api.statusUPnP);
    yield put(a.updateDappnodeParams({ ...dappnodeParams, ...statusUpnp }));
  } catch (e) {
    console.error(`Error on fetchDappnodeParams: ${e.stack}`);
  }
}

export function* fetchDappnodeStats() {
  try {
    yield call(assertConnectionOpen);
    const dappnodeStats = yield call(api.getStats);
    yield put(a.updateDappnodeStats(dappnodeStats));
  } catch (e) {
    console.error(`Error on fetchDappnodeStats: ${e.stack}`);
  }
}

export function* fetchDappnodeDiagnose() {
  try {
    yield call(assertConnectionOpen);
    const dappnoseDiagnose = yield call(api.diagnose);
    yield put(a.updateDappnodeDiagnose(dappnoseDiagnose));
  } catch (e) {
    console.error(`Error on fetchDappnodeDiagnose: ${e.stack}`);
  }
}

export function* pingDappnodeDnps() {
  try {
    yield call(assertConnectionOpen);
    for (const dnp of ["dappmanager", "vpn"]) {
      const pingReturn = yield call(api[dnp].ping);
      yield put(a.updatePingReturn(dnp, pingReturn));
    }
  } catch (e) {
    console.error(`Error on pingDappnodeDnps: ${e.stack}`);
  }
}

export function* checkIpfsConnectionStatus() {
  try {
    try {
      yield call(checkIpfsConnection);
      yield put(a.updateIpfsConnectionStatus({ resolves: true }));
    } catch (e) {
      yield put(
        a.updateIpfsConnectionStatus({
          resolves: false,
          error: e.message
        })
      );
    }
  } catch (e) {
    console.error(`Error on checkIpfsConnectionStatus: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  ["CONNECTION_OPEN", fetchDappnodeParams],
  ["CONNECTION_OPEN", fetchDappnodeStats],
  ["CONNECTION_OPEN", fetchDappnodeDiagnose],
  ["CONNECTION_OPEN", pingDappnodeDnps],
  ["CONNECTION_OPEN", checkIpfsConnectionStatus],
  [t.FETCH_DAPPNODE_PARAMS, fetchDappnodeParams],
  [t.FETCH_DAPPNODE_STATS, fetchDappnodeStats],
  [t.FETCH_DAPPNODE_DIAGNOSE, fetchDappnodeDiagnose],
  [t.PING_DAPPNODE_DNPS, pingDappnodeDnps]
]);
