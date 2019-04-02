import { call, put, fork, all } from "redux-saga/effects";
import semver from "semver";
import uuidv4 from "uuid/v4";
// This page
import * as a from "./actions";
import * as t from "./actionTypes";
// External actions
import { pushNotification } from "services/notifications/actions";
import { fetchDappnodeParams } from "services/dappnodeStatus/actions";
import { fetchDevices } from "services/devices/actions";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
// Utilities
import api from "API/rpcMethods";
import { rootWatcher } from "utils/redux";
import isSyncing from "utils/isSyncing";

/**
 * To modify the core id for DEV ONLY purposes, do
 *   localStorage.setItem('DEVONLY-core-id', 'core.dnp.dappnode.eth@/ipfs/Qm5sxx...');
 *    or
 *   setCoreIdIpfs('/ipfs/Qm5sxx...')
 *    or
 *   setCoreId('core.dnp.dappnode.eth@0.1.1')
 *    then
 *   restoreCoreId()
 * And refresh the page
 */
const coreIdLocalStorageTag = "DEVONLY-core-id";
const coreId =
  localStorage.getItem(coreIdLocalStorageTag) || "core.dnp.dappnode.eth";
const coreIdDevSet = localStorage.getItem(coreIdLocalStorageTag);
// Methods to edit the coreID
window.setCoreId = id => {
  localStorage.setItem(coreIdLocalStorageTag, id);
  return `Set core id to id ${id}`;
};
window.setCoreIdIpfs = hash => {
  localStorage.setItem(coreIdLocalStorageTag, `core.dnp.dappnode.eth@${hash}`);
  return `Set core id to IPFS hash ${hash}`;
};
window.restoreCoreId = () => {
  localStorage.removeItem(coreIdLocalStorageTag);
  return `Deleted custom DEVONLY core id setting`;
};

/***************************** Subroutines ************************************/

function shouldUpdate(v1, v2) {
  // currentVersion, newVersion
  v1 = semver.valid(v1) || "999.9.9";
  v2 = semver.valid(v2) || "999.9.9";
  return semver.lt(v1, v2);
}

function* putMainnetIsStillSyncing() {
  try {
    yield put({ type: "UPDATE_IS_SYNCING", isSyncing: true });
    yield put(
      pushNotification({
        notification: {
          id: "mainnetStillSyncing",
          type: "warning",
          title: "System update available",
          body:
            "Ethereum mainnet is still syncing. Until complete syncronization you will not be able to navigate to decentralized websites or install packages via .eth names."
        }
      })
    );
  } catch (e) {
    console.error(`Error putting mainnet is still syncing: ${e.stack}`);
  }
}

function* fetchManifest(id) {
  try {
    const { manifest } = yield call(api.fetchPackageData, { id });
    return manifest;
  } catch (e) {
    // Check if the dappmanager says mainnet is still syncing
    if (e.message.includes("Mainnet is still syncing"))
      yield call(putMainnetIsStillSyncing);
    console.error(`Error fetching manifest for ${id}, ${e.stack}`);
  }
}

export function* checkCoreUpdate() {
  try {
    // If chain is not synced yet, cancel request.
    if (yield call(isSyncing)) {
      return yield call(putMainnetIsStillSyncing);
    }

    const packages = yield call(api.listPackages);
    const coreManifest = yield call(fetchManifest, coreId);
    // Abort on error
    if (!coreManifest) {
      return console.error("Error getting core manifest");
    }
    const coreDeps = coreManifest.dependencies;
    const coreDepsToInstall = [];
    yield all(
      Object.keys(coreDeps).map(coreDep =>
        call(function*() {
          const pkg = packages.find(p => p.name === coreDep);
          const id = coreDep + "@" + coreDeps[coreDep];
          //                    currentVersion, newVersion
          if (!pkg || shouldUpdate(pkg.version, coreDeps[coreDep])) {
            const depManifest = yield call(fetchManifest, id);
            coreDepsToInstall.push({
              name: coreDep,
              from: (pkg || {}).version,
              to: coreDeps[coreDep],
              manifest: depManifest
            });
          }
        })
      )
    );

    // Update core update info
    yield put(a.updateCoreManifest(coreManifest));
    yield put(a.updateCoreDeps(coreDepsToInstall));
  } catch (e) {
    console.error(`Error on checkCoreUpdate: ${e.stack}`);
  }
}

let updatingCore = false;
function* updateCore() {
  try {
    // Prevent double installations
    if (updatingCore) {
      return console.error("Error: DAppNode core is already updating");
    }
    const logId = uuidv4();

    // blacklist the current package
    updatingCore = true;

    yield call(
      api.installPackageSafe,
      {
        id: coreId,
        logId,
        ...(coreIdDevSet ? { options: { BYPASS_CORE_RESTRICTION: true } } : {})
      },
      { toastMessage: "Updating DAppNode core..." }
    );

    // Remove package from blacklist
    updatingCore = false;

    // Call checkCoreUpdate to compute hide the "Update" warning and buttons
    yield call(checkCoreUpdate());
  } catch (e) {
    console.error(`Error on updateCore: ${e.stack}`);
  }
}

function* setStaticIp({ staticIp }) {
  try {
    yield call(
      api.setStaticIp,
      { staticIp },
      { toastMessage: "setting static ip...", throw: true }
    );

    // Show notification to upgrade VPN profiles
    yield put(
      pushNotification({
        notification: {
          id: "staticIpUpdated",
          type: "warning",
          title: "Update connection profiles",
          body:
            "Your static IP was changed, please download and install your VPN connection profile again. Instruct your users to do so also."
        }
      })
    );

    // Refresh App state
    yield put(fetchDappnodeParams());
    yield put(fetchDevices());
  } catch (e) {
    console.error(`Error on setStaticIp: ${e.stack}`);
  }
}

function* onConnectionOpen(action) {
  yield fork(checkCoreUpdate, action);
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [CONNECTION_OPEN, onConnectionOpen],
  [t.UPDATE_CORE, updateCore],
  [t.SET_STATIC_IP, setStaticIp]
];

export default rootWatcher(watchers);
