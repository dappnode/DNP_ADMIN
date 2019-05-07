import { put, call, all } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import checkIpfsConnection from "./diagnoseFunctions/checkIpfsNode";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
import { wrapErrorsAndLoading } from "services/loadingStatus/sagas";
import * as loadingIds from "services/loadingStatus/loadingIds";
// Utils
import { assertConnectionOpen } from "utils/redux";

// Service > dappnodeStatus

// It's okay, because all non-handled sagas are wrapped on a try/catch
/* eslint-disable redux-saga/no-unhandled-errors */

/**
 * Fetches the DAppNode params and statusUpnp from the VPN
 * [Tested]
 */
export const fetchDappnodeParams = wrapErrorsAndLoading(
  loadingIds.dappnodeParams,
  function*() {
    const dappnodeParams = yield call(api.getParams);
    yield put(a.updateDappnodeParams(dappnodeParams));
  }
);

/**
 * Calls getStats. The DAPPMANAGER will return the machine stats
 * stats = {
 *   cpu: "58%",
 *   memory: "25%",
 *   disk: "86%""
 * }
 */
const fetchDappnodeStats = wrapErrorsAndLoading(
  loadingIds.dappnodeStats,
  function*() {
    const dappnodeStats = yield call(api.getStats);
    yield put(a.updateDappnodeStats(dappnodeStats));
  }
);

/**
 * Calls diagnose. The DAPPMANAGER will return various information about it:
 * - docker version
 * - docker-compose version
 */
const fetchDappnodeDiagnose = wrapErrorsAndLoading(
  loadingIds.dappnodeDiagnose,
  function*() {
    const dappnoseDiagnose = yield call(api.diagnose);
    yield put(a.updateDappnodeDiagnose(dappnoseDiagnose));
  }
);

/**
 * Calls each DNP's WAMP method `ping`
 * - If the ping succeeds, returns the DNP versionData
 * - On error, returns null
 * Should never throw
 */
const pingDappnodeDnps = wrapErrorsAndLoading(
  loadingIds.pingDappnodeDnps,
  function*() {
    yield call(assertConnectionOpen);
    for (const dnp of ["dappmanager", "vpn"]) {
      try {
        yield call(api[dnp].ping, { test: "test-ping" });
        // If the previous call does not throw, the ping was successful
        yield put(a.updatePingReturn(dnp, true));
      } catch (e) {
        console.error(`Error on pingDappnodeDnps/${dnp}: ${e.stack}`);
        yield put(a.updatePingReturn(dnp, false));
      }
    }
  }
);

const getDnpsVersionData = wrapErrorsAndLoading(
  loadingIds.versionData,
  function*() {
    yield call(assertConnectionOpen);
    for (const dnp of ["dappmanager", "vpn"]) {
      try {
        const versionData = yield call(api[dnp].getVersionData);
        yield put(a.updateVersionData(dnp, versionData));
      } catch (e) {
        console.error(`Error on getDnpsVersionData/${dnp}: ${e.stack}`);
      }
    }
  }
);

/**
 * Calls checkIpfsConnection: Attempts to cat a common IPFS hash
 * - If the cat succeeds, returns { resolves: true }
 * - On error, returns { resolves: false, error: e.message }
 * Should never throw
 */
const checkIpfsConnectionStatus = wrapErrorsAndLoading(
  loadingIds.ipfsConnectionStatus,
  function*() {
    const { resolves, error } = yield call(checkIpfsConnection);
    yield put(a.updateIpfsConnectionStatus({ resolves, error }));
  }
);

/**
 * Aggregates all previous data fetches
 */
function* fetchAllDappnodeStatus() {
  try {
    yield all([
      call(fetchDappnodeParams),
      call(fetchDappnodeStats),
      call(fetchDappnodeDiagnose),
      call(pingDappnodeDnps),
      call(getDnpsVersionData),
      call(checkIpfsConnectionStatus)
    ]);
  } catch (e) {
    console.error(`Error on fetchAllDappnodeStatus: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  // Fetch everything
  [CONNECTION_OPEN, fetchAllDappnodeStatus],
  [t.FETCH_ALL_DAPPNODE_STATUS, fetchAllDappnodeStatus],
  // Fetch single data
  [t.FETCH_DAPPNODE_PARAMS, fetchDappnodeParams],
  [t.FETCH_DAPPNODE_STATS, fetchDappnodeStats],
  [t.FETCH_DAPPNODE_DIAGNOSE, fetchDappnodeDiagnose],
  [t.PING_DAPPNODE_DNPS, pingDappnodeDnps]
]);
