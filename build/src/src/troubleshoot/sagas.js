import { call, all, fork, put, take, race, select } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import assertConnectionOpen from "utils/assertConnectionOpen";
import APIcall from "API/rpcMethods";
import t from "./actionTypes";
import * as a from "./actions";
import diagnoses from "./diagnoses";

import pingPackage from "utils/pingPackage";

/***************************** Subroutines ************************************/

function* diagnoseDappmanager() {
  try {
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
  } catch (e) {
    console.error(`Error on diagnoseDappmanager: ${e.stack}`);
  }
}

function* diagnoseVpn() {
  try {
    const session = yield select(state => state.session);
    const isConnected = yield call(pingPackage, session, "vpn");
    yield put(
      a.updateDiagnose({
        ok: isConnected,
        msg: isConnected ? "VPN is connected" : "VPN is not connected"
      })
    );
  } catch (e) {
    console.error(`Error on diagnoseVpn: ${e.stack}`);
  }
}

function* diagnoseIpfs() {
  try {
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
  } catch (e) {
    console.error(`Error on diagnoseIpfs: ${e.stack}`);
  }
}

function* diagnoseOpenPorts() {
  try {
    const _diagnose = yield call(diagnoses.diagnoseOpenPorts);
    yield put(a.updateDiagnose(_diagnose));
  } catch (e) {
    console.error(`Error on diagnoseOpenPorts: ${e.stack}`);
  }
}

function* diagnoseNatLoopback() {
  try {
    const _diagnose = yield call(diagnoses.diagnoseNatLoopback);
    yield put(a.updateDiagnose(_diagnose));
  } catch (e) {
    console.error(`Error on diagnoseNatLoopback: ${e.stack}`);
  }
}

function* diagnoseConnection() {
  try {
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
      yield fork(diagnoseOpenPorts);
      yield fork(diagnoseNatLoopback);
    }
  } catch (e) {
    console.error(`Error on diagnoseConnection: ${e.stack}`);
  }
}

export function* runDiagnoses() {
  try {
    // Fetch info
    yield fork(fetchInfo);
    // Run diagnoses
    yield put(a.clearDiagnose());
    yield call(diagnoseConnection);
  } catch (e) {
    console.error(`Error on runDiagnoses: ${e.stack}`);
  }
}

export function* fetchInfo() {
  try {
    yield call(assertConnectionOpen);
    yield all([
      call(fetchPackages),
      call(fetchDiskUsage),
      call(diagnoseCallDappmanager)
    ]);
  } catch (e) {
    console.error(`Error on fetchInfo: ${e.stack}`);
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function* diagnoseCallDappmanager() {
  console.log("calling diagnose");
  try {
    const res = yield call(APIcall.diagnose);
    if (!res.success)
      throw Error("Unsuccessful reponse to diagnose: " + res.message);
    for (const itemId of Object.keys(res.result)) {
      const item = res.result[itemId];
      item.name = capitalize(item.name);
      yield put(a.updateSystemInfo(itemId, item));
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
    yield put(
      a.updateSystemInfo("diskUsage", {
        name: "Disk usage",
        result: res.result.disk
      })
    );
  } catch (e) {
    console.error("Error fetching installed packages", e);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  //
  [t.DIAGNOSE, runDiagnoses]
];

export default rootWatcher(watchers);
