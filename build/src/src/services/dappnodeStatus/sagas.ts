import { put, call, all } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
import * as a from "./actions";
import { connectionOpen } from "services/connectionStatus/actions";
// Utils
import { stringSplit, stringIncludes } from "utils/strings";
import { wifiName } from "params";
import { VolumeData } from "types";

// Service > dappnodeStatus

/**
 * Fetches the DAppNode params and statusUpnp from the VPN
 * [Tested]
 */
function* fetchDappnodeParams() {
  try {
    const systemInfo = yield call(api.systemInfoGet);
    yield put(a.setSystemInfo(systemInfo));
  } catch (e) {
    console.error("Error on fetchDappnodeParams", e);
  }
}

/**
 * Get the logs of the WIFI package to check if it's running or not
 * `[Warning] No interface found. Entering sleep mode.`
 */
function* fetchWifiStatus() {
  try {
    const logs = yield call(api.logPackage, { id: wifiName });
    const firstLogLine = stringSplit(logs.trim(), "\n")[0];
    const running = !stringIncludes(firstLogLine, "No interface found");
    yield put(a.updateWifiStatus({ running }));
  } catch (e) {
    console.error("Error on fetchWifiStatus", e);
  }
}

/**
 * Check if the SSH password is secure
 */
function* fetchPasswordIsInsecure() {
  try {
    const passwordIsSecure = yield call(api.passwordIsSecure);
    yield put(a.updatePasswordIsInsecure(!passwordIsSecure));
  } catch (e) {
    console.error("Error on fetchPasswordIsInsecure", e);
  }
}

/**
 * Get DAppNode docker volumes
 */
function* fetchVolumes() {
  try {
    // If there are no settings the return will be null
    const volumes: VolumeData[] = yield call(api.volumesGet);
    yield put(a.updateVolumes(volumes));
  } catch (e) {
    console.error("Error on fetchVolumes", e);
  }
}

/**
 * Aggregates all previous data fetches
 */
function* fetchAllDappnodeStatus() {
  try {
    yield all([
      call(fetchDappnodeParams),
      call(fetchWifiStatus),
      call(fetchPasswordIsInsecure),
      call(fetchVolumes)
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
  [connectionOpen.toString(), fetchAllDappnodeStatus],
  [fetchAllDappnodeStatus.toString(), fetchAllDappnodeStatus],
  // Fetch single data
  [a.fetchDappnodeParams.toString(), fetchDappnodeParams],
  [a.fetchPasswordIsInsecure.toString(), fetchPasswordIsInsecure]
]);
