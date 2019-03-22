import { call, put, fork, all } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import t from "./actionTypes";
import * as a from "./actions";
import semver from "semver";
import Toast from "components/toast/Toast";
import uuidv4 from "uuid/v4";
import installer from "installer";
import isSyncing from "utils/isSyncing";
import navbar from "navbar";

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

function isEmpty(obj) {
  if (!obj) return true;
  return !Boolean(Object.getOwnPropertyNames(obj).length);
}

function* fetchManifest(id) {
  try {
    const res = yield call(APIcall.fetchPackageData, { id });
    // Check if the dappmanager says mainnet is still syncing
    if ((res.message || "").includes("Mainnet is still syncing")) {
      return yield put({ type: "UPDATE_IS_SYNCING", isSyncing: true });
    }
    if (!res.success || isEmpty(res.result)) {
      throw ("Error on fetchPackageData", res.message);
    }
    return res.result.manifest;
  } catch (e) {
    console.error(`Error fetching manifest for ${id}, ${e.stack}`);
  }
}

export function* checkCoreUpdate() {
  try {
    // If chain is not synced yet, cancel request.
    if (yield call(isSyncing)) {
      return yield call(putMainnetIsStillSyncing);
    }

    const packagesRes = yield call(APIcall.listPackages);
    const coreManifest = yield call(fetchManifest, coreId);

    // Abort on error
    if (!packagesRes.success || isEmpty(packagesRes.result)) {
      return console.error("Error listing packages", packagesRes.message);
    }
    if (!coreManifest) {
      return console.error("Error getting core manifest");
    }
    const packages = packagesRes.result;
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
    yield put({ type: t.UPDATE_CORE_MANIFEST, coreManifest });
    yield put({ type: t.UPDATE_CORE_DEPS, coreDeps: coreDepsToInstall });
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

let updatingCore = false;
function* updateCore() {
  try {
    // Prevent double installations
    if (updatingCore) {
      return console.error("DAPPNODE CORE IS ALREADY UPDATING");
    }
    const logId = uuidv4();
    const pendingToast = new Toast({
      message: "Updating DAppNode core...",
      pending: true
    });
    // blacklist the current package
    updatingCore = true;
    const res = yield call(APIcall.installPackageSafe, {
      id: coreId,
      logId,
      ...(localStorage.getItem(coreIdLocalStorageTag)
        ? { options: { BYPASS_CORE_RESTRICTION: true } }
        : {})
    });
    yield put({ type: installer.actionTypes.CLEAR_PROGRESS_LOG, logId });
    // Remove package from blacklist
    updatingCore = false;
    pendingToast.resolve(res);

    // Call checkCoreUpdate to compute hide the "Update" warning and buttons
    yield call(checkCoreUpdate);
  } catch (e) {
    console.error(`Error updating core: ${e.stack}`);
  }
}

function* setStaticIp({ staticIp }) {
  try {
    const pendingToast = new Toast({
      message: "setting static ip...",
      pending: true
    });
    const res = yield call(APIcall.setStaticIp, { staticIp });
    pendingToast.resolve(res);
    yield put({ type: "FETCH_DAPPNODE_PARAMS" });
    yield put({ type: "LIST_DEVICES" });
    yield put({
      type: navbar.actionTypes.PUSH_NOTIFICATION,
      notification: {
        id: "staticIpUpdated",
        type: "warning",
        title: "Update connection profiles",
        body:
          "Your static IP was changed, please download and install your VPN connection profile again. Instruct your users to do so also."
      }
    });
    yield call(getStaticIp);
  } catch (e) {
    console.error("Error setting static IP:", e);
  }
}

function* getStaticIp() {
  try {
    const res = yield call(APIcall.getParams);
    const { staticIp } = (res || {}).result || {};
    yield put(a.updateStaticIp(staticIp));
    yield put(a.updateStaticIpInput(staticIp));
  } catch (e) {
    console.error("Error getting static IP:", e);
  }
}

function* onConnectionOpen(action) {
  yield fork(checkCoreUpdate, action);
  yield fork(getStaticIp, action);
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  ["CONNECTION_OPEN", onConnectionOpen],
  [t.UPDATE_CORE, updateCore],
  [t.SET_STATIC_IP, setStaticIp]
];

export default rootWatcher(watchers);
