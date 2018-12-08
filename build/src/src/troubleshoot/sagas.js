import { call, fork, put, take, race, select } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import assertConnectionOpen from "utils/assertConnectionOpen";
import * as APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import * as selector from "./selectors";

import pingPackage from "utils/pingPackage";

/***************************** Subroutines ************************************/

function* diagnoseDappmanager() {
  const session = yield select(state => state.session);
  const isConnected = yield call(pingPackage, session, "dappmanager");
  yield put(
    a.updateDiagnose({
      ok: session.isOpen,
      msg: isConnected
        ? "DAPPMANAGER connected"
        : "DAPPMANAGER is not connected"
    })
  );
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
    yield call(diagnoseDappmanager);
  }
}

export function* diagnose() {
  // Fetch info
  yield fork(fetchInfo);
  // Run diagnoses
  yield put(a.clearDiagnose());
  yield call(diagnoseConnection);
}

export function* fetchInfo() {
  yield call(fetchPackages);
}

export function* fetchPackages() {
  try {
    yield call(assertConnectionOpen);
    const res = yield call(APIcall.listPackages);
    if (!res.success)
      throw Error("Unsuccessful reponse to listPackages: " + res.message);
    yield put(a.updateInfo("packageList", res.result));
  } catch (e) {
    console.error("Error fetching installed packages", e);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  [t.DIAGNOSE]: diagnose
};

export default rootWatcher(watchers);
