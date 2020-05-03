import { put, call, all } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
import * as a from "./actions";
import { connectionOpen } from "services/connectionStatus/actions";
import { wrapErrorsAndLoading } from "services/loadingStatus/sagas";
import * as loadingIds from "services/loadingStatus/loadingIds";
// Utils
import { stringSplit, stringIncludes } from "utils/strings";
import { wifiName } from "params";
import { VolumeData } from "types";

// Service > dappnodeStatus

/**
 * Fetches the DAppNode params and statusUpnp from the VPN
 * [Tested]
 */
export const fetchDappnodeParams = wrapErrorsAndLoading(
  loadingIds.systemInfo,
  function*() {
    const systemInfo = yield call(api.systemInfoGet);
    yield put(a.setSystemInfo(systemInfo));
  }
);

/**
 * Get the logs of the WIFI package to check if it's running or not
 * `[Warning] No interface found. Entering sleep mode.`
 */
const checkWifiStatus = wrapErrorsAndLoading(
  loadingIds.wifiStatus,
  function*() {
    const logs = yield call(api.logPackage, { id: wifiName });
    const firstLogLine = stringSplit(logs.trim(), "\n")[0];
    const running = !stringIncludes(firstLogLine, "No interface found");
    yield put(a.updateWifiStatus({ running }));
  }
);

/**
 * Check if the SSH password is secure
 */
const checkIfPasswordIsInsecure = wrapErrorsAndLoading(
  loadingIds.passwordIsInsecure,
  function*() {
    const passwordIsSecure = yield call(api.passwordIsSecure);
    yield put(a.updatePasswordIsInsecure(!passwordIsSecure));
  }
);

/**
 * Get DAppNode docker volumes
 */
const fetchVolumes = wrapErrorsAndLoading(loadingIds.volumes, function*() {
  // If there are no settings the return will be null
  const volumes: VolumeData[] = yield call(api.volumesGet);
  yield put(a.updateVolumes(volumes));
});

/**
 * Aggregates all previous data fetches
 */
function* fetchAllDappnodeStatus() {
  try {
    yield all([
      call(fetchDappnodeParams),
      call(checkWifiStatus),
      call(checkIfPasswordIsInsecure),
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
  [a.fetchPasswordIsInsecure.toString(), checkIfPasswordIsInsecure]
]);
