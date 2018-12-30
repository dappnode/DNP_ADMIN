import { call, all, fork, put, take, race, select } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import assertConnectionOpen from "utils/assertConnectionOpen";
import * as APIcall from "API/rpcMethods";
import t from "./actionTypes";
import * as a from "./actions";
import diagnoses from "./diagnoses";

import pingPackage from "utils/pingPackage";

/***************************** Subroutines ************************************/

function* diagnoseDappmanager() {
  const session = yield select(state => state.session);
  const isConnected = yield call(pingPackage, session, "dappmanager");
  yield put(
    a.updateDiagnose({
      ok: isConnected,
      msg: isConnected
        ? "DAPPMANAGER is connected"
        : "DAPPMANAGER is not connected"
    })
  );
}

function* diagnoseVpn() {
  const session = yield select(state => state.session);
  const isConnected = yield call(pingPackage, session, "vpn");
  yield put(
    a.updateDiagnose({
      ok: isConnected,
      msg: isConnected ? "VPN is connected" : "VPN is not connected"
    })
  );
}

function* diagnoseIpfs() {
  const { ok, msg } = yield call(diagnoses.diagnoseIpfs);
  yield put(
    a.updateDiagnose({
      ok,
      msg: ok ? "IPFS resolves" : "IPFS is not resolving: " + msg,
      solution: [
        `Go to the system tab and make sure IPFS is running. Otherwise open the package and click 'restart'`,
        `If the problem persist make sure your disc has not run of space; IPFS may malfunction in that case.`
      ]
    })
  );
}

function* diagnoseUpnp() {
  const _diagnose = yield call(diagnoses.diagnoseUpnp);
  yield put(a.updateDiagnose(_diagnose));
}

function* diagnoseExternalIp() {
  const _diagnose = yield call(diagnoses.diagnoseExternalIp);
  yield put(a.updateDiagnose(_diagnose));
}

function* diagnoseConnection() {
  const connectionAttempted = yield select(state => state.session);
  if (!connectionAttempted) {
    yield race([take("CONNECTION_OPEN"), take("CONNECTION_CLOSE")]);
  }
  const session = yield select(state => state.session);
  yield put(
    a.updateDiagnose({
      ok: session.isOpen,
      msg: session.isOpen ? "Session is open" : "Session is closed",
      solution: [
        `You may be disconnected from your DAppNode's VPN. Please make sure your connection is still active`,
        `If you are still connected, disconnect your VPN connection, connect again and refresh this page`
      ]
    })
  );
  if (session.isOpen) {
    yield fork(diagnoseDappmanager);
    yield fork(diagnoseVpn);
    yield fork(diagnoseIpfs);
    yield fork(diagnoseUpnp);
    yield fork(diagnoseExternalIp);
  }
}

export function* runDiagnoses() {
  // Fetch info
  yield fork(fetchInfo);
  // Run diagnoses
  yield put(a.clearDiagnose());
  yield call(diagnoseConnection);
}

export function* fetchInfo() {
  yield call(assertConnectionOpen);
  yield all([
    call(fetchPackages),
    call(fetchDiskUsage),
    call(diagnoseCallDappmanager)
  ]);
}

export function* diagnoseCallDappmanager() {
  console.log("calling diagnose");
  try {
    const res = yield call(APIcall.diagnose);
    console.log("res", res);
    if (!res.success)
      throw Error("Unsuccessful reponse to diagnose: " + res.message);
    for (const itemId of Object.keys(res.result)) {
      const item = res.result[itemId];
      yield put(a.updateInfo(itemId, item));
    }
  } catch (e) {
    console.error(`Error calling dappmanager's diagnose`, e);
  }
}

export function* fetchPackages() {
  try {
    const res = yield call(APIcall.listPackages);
    if (!res.success)
      throw Error("Unsuccessful reponse to listPackages: " + res.message);
    yield put(a.updateInfo("packageList", res.result));
  } catch (e) {
    console.error("Error fetching installed packages", e);
  }
}

export function* fetchDiskUsage() {
  try {
    const res = yield call(APIcall.getStats);
    if (!res.success || (res.success && !res.result))
      throw Error("Unsuccessful reponse to getStats: " + res.message);
    yield put(a.updateInfo("diskUsage", res.result.disk));
  } catch (e) {
    console.error("Error fetching installed packages", e);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  [t.DIAGNOSE]: runDiagnoses
};

export default rootWatcher(watchers);
