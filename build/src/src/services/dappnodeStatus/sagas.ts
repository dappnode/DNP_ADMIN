import { put, call, all } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
import * as a from "./actions";
import * as t from "./types";
import checkIpfsConnection from "./diagnoseFunctions/checkIpfsNode";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
import { wrapErrorsAndLoading } from "services/loadingStatus/sagas";
import * as loadingIds from "services/loadingStatus/loadingIds";
// Utils
import { stringSplit, stringIncludes } from "utils/strings";
import { wifiName } from "params";
import { MountpointData, VolumeData } from "types";

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

const fetchVpnVersionData = wrapErrorsAndLoading(
  loadingIds.versionData,
  function*() {
    // yield call(assertConnectionOpen);
    // const vpnVersionData = yield call(apiOld.vpn.getVpnVersionData);
    // yield put(a.updateVpnVersionData(vpnVersionData));
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
 * Get the auto-update data:
 * - settings
 * - registry
 * - pending
 */
const fetchAutoUpdateData = wrapErrorsAndLoading(
  loadingIds.autoUpdateData,
  function*() {
    // If there are no settings the return will be null
    const autoUpdateData = yield call(api.autoUpdateDataGet);
    yield put(a.updateAutoUpdateData(autoUpdateData) || {});
  }
);

/**
 * Get DAppNode host mountpoints
 * ONLY FETCH on request, NOT on connection open
 */
const fetchMountpointData = wrapErrorsAndLoading(
  loadingIds.mountpoints,
  function*() {
    // If there are no settings the return will be null
    const mountpoints: MountpointData[] = yield call(api.mountpointsGet);
    yield put(a.updateMountpoints(mountpoints));
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
      call(fetchDappnodeStats),
      call(fetchVpnVersionData),
      call(fetchDappnodeDiagnose),
      call(checkIpfsConnectionStatus),
      call(checkWifiStatus),
      call(checkIfPasswordIsInsecure),
      call(fetchAutoUpdateData),
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
  [CONNECTION_OPEN, fetchAllDappnodeStatus],
  [t.FETCH_ALL_DAPPNODE_STATUS, fetchAllDappnodeStatus],
  // Fetch single data
  [t.FETCH_DAPPNODE_PARAMS, fetchDappnodeParams],
  [t.FETCH_DAPPNODE_STATS, fetchDappnodeStats],
  [t.FETCH_DAPPNODE_DIAGNOSE, fetchDappnodeDiagnose],
  [t.FETCH_IF_PASSWORD_IS_INSECURE, checkIfPasswordIsInsecure],
  [t.FETCH_MOUNTPOINTS, fetchMountpointData]
]);
