import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import { assertConnectionOpen } from "utils/redux";
import checkIpfsConnection from "./diagnoseFunctions/checkIpfsNode";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";

// Service > dappnodeStatus

/**
 * Fetches the DAppNode params and statusUpnp from the VPN
 * [Tested]
 */
export function* fetchDappnodeParams() {
  try {
    const dappnodeParams = yield call(api.getParams);
    const statusUpnp = yield call(api.statusUPnP);
    yield put(a.updateDappnodeParams({ ...dappnodeParams, ...statusUpnp }));
  } catch (e) {
    console.error(`Error on fetchDappnodeParams: ${e.stack}`);
  }
}

/**
 * Calls getStats. The DAPPMANAGER will return the machine stats
 * stats = {
 *   cpu: "58%",
 *   memory: "25%",
 *   disk: "86%""
 * }
 */
export function* fetchDappnodeStats() {
  try {
    yield call(assertConnectionOpen);
    const dappnodeStats = yield call(api.getStats);
    yield put(a.updateDappnodeStats(dappnodeStats));
  } catch (e) {
    console.error(`Error on fetchDappnodeStats: ${e.stack}`);
  }
}

/**
 * Calls diagnose. The DAPPMANAGER will return various information about it:
 * - docker version
 * - docker-compose version
 */
export function* fetchDappnodeDiagnose() {
  try {
    yield call(assertConnectionOpen);
    const dappnoseDiagnose = yield call(api.diagnose);
    yield put(a.updateDappnodeDiagnose(dappnoseDiagnose));
  } catch (e) {
    console.error(`Error on fetchDappnodeDiagnose: ${e.stack}`);
  }
}

/**
 * Calls each DNP's WAMP method `ping`
 * - If the ping succeeds, returns the DNP versionData
 * - On error, returns null
 * Should never throw
 */
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

/**
 * Calls checkIpfsConnection: Attempts to cat a common IPFS hash
 * - If the cat succeeds, returns { resolves: true }
 * - On error, returns { resolves: false, error: e.message }
 * Should never throw
 */
export function* checkIpfsConnectionStatus() {
  try {
    const { resolves, error } = yield call(checkIpfsConnection);
    yield put(a.updateIpfsConnectionStatus({ resolves, error }));
  } catch (e) {
    console.error(`Error on checkIpfsConnectionStatus: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  [CONNECTION_OPEN, fetchDappnodeParams],
  [CONNECTION_OPEN, fetchDappnodeStats],
  [CONNECTION_OPEN, fetchDappnodeDiagnose],
  [CONNECTION_OPEN, pingDappnodeDnps],
  [CONNECTION_OPEN, checkIpfsConnectionStatus],
  [t.FETCH_DAPPNODE_PARAMS, fetchDappnodeParams],
  [t.FETCH_DAPPNODE_STATS, fetchDappnodeStats],
  [t.FETCH_DAPPNODE_DIAGNOSE, fetchDappnodeDiagnose],
  [t.PING_DAPPNODE_DNPS, pingDappnodeDnps]
]);
