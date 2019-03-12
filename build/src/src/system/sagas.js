import { call, put, fork } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import t from "./actionTypes";
import * as a from "./actions";
import semver from "semver";
import Toast from "components/Toast";
import uuidv4 from "uuid/v4";
import installer from "installer";
import isSyncing from "utils/isSyncing";
import navbar from "navbar";

/***************************** Subroutines ************************************/

function shouldUpdate(v1, v2) {
  // currentVersion, newVersion
  v1 = semver.valid(v1) || "999.9.9";
  v2 = semver.valid(v2) || "999.9.9";
  return semver.lt(v1, v2);
}

function isEmpty(obj) {
  return !Boolean(Object.getOwnPropertyNames(obj).length);
}

function* putMainnetIsStillSyncing() {
  try {
    yield put({ type: "UPDATE_IS_SYNCING", isSyncing: true });
    yield put({
      type: navbar.actionTypes.PUSH_NOTIFICATION,
      notification: {
        id: "mainnetStillSyncing",
        type: "warning",
        title: "System update available",
        body:
          "Ethereum mainnet is still syncing. Until complete syncronization you will not be able to navigate to decentralized websites or install packages via .eth names."
      }
    });
  } catch (e) {
    console.error(`Error putting mainnet is still syncing: ${e.stack}`);
  }
}

export function* checkCoreUpdate() {
  try {
    // If chain is not synced yet, cancel request.
    if (yield call(isSyncing)) {
      return yield call(putMainnetIsStillSyncing);
    }

    const packagesRes = yield call(APIcall.listPackages);
    const coreDataRes = yield call(APIcall.fetchPackageData, {
      id: "core.dnp.dappnode.eth"
    });

    // Check if the dappmanager says mainnet is still syncing
    if (
      coreDataRes.message &&
      coreDataRes.message.includes("Mainnet is still syncing")
    ) {
      return yield call(putMainnetIsStillSyncing);
    }
    // Abort on error
    if (
      !packagesRes.success ||
      !packagesRes.result ||
      isEmpty(packagesRes.result)
    ) {
      return console.error("Error listing packages", packagesRes.message);
    }
    if (
      !coreDataRes.success ||
      !coreDataRes.result ||
      isEmpty(coreDataRes.result)
    ) {
      return console.error("Error getting coreData", coreDataRes.message);
    }
    const packages = packagesRes.result;
    const coreData = coreDataRes.result;

    const coreDeps = coreData.manifest.dependencies;
    const coreDepsToInstall = [];
    Object.keys(coreDeps).forEach(coreDep => {
      const pkg = packages.find(p => p.name === coreDep);
      if (!pkg)
        coreDepsToInstall.push({
          name: coreDep,
          from: "none",
          to: coreDeps[coreDep]
        });
      else {
        const currentVersion = pkg.version;
        const newVersion = coreDeps[coreDep];
        if (shouldUpdate(currentVersion, newVersion)) {
          coreDepsToInstall.push({
            name: coreDep,
            from: currentVersion,
            to: newVersion
          });
        }
      }
    });

    yield put({
      type: t.CORE_DEPS,
      coreDeps: coreDepsToInstall
    });

    if (coreDepsToInstall.length) {
      yield put({
        type: navbar.actionTypes.PUSH_NOTIFICATION,
        notification: {
          id: "systemUpdateAvailable",
          type: "danger",
          title: "System update available",
          body:
            "DAppNode System Update Available. Go to the System tab to review and approve the update."
        }
      });
    }
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
      id: "core.dnp.dappnode.eth",
      logId
    });
    yield put({ type: installer.actionTypes.CLEAR_PROGRESS_LOG, logId });
    // Remove package from blacklist
    updatingCore = false;
    pendingToast.resolve(res);

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
