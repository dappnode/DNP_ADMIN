import { call, put, takeEvery, all } from "redux-saga/effects";
import * as APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import semver from "semver";
import Toast from "components/Toast";
import uuidv4 from "uuid/v4";
import installer from "installer";

/***************************** Subroutines ************************************/

export function* listPackages() {
  try {
    yield put({ type: t.UPDATE_FETCHING, fetching: true });
    const res = yield call(APIcall.listPackages);
    yield put({ type: t.UPDATE_FETCHING, fetching: false });
    if (res.success) {
      yield put(a.updatePackages(res.result));
    } else {
      new Toast(res);
    }

    // listPackages CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: [{
    //     id: '927623894...', (string)
    //     isDNP: true, (boolean)
    //     created: <Date string>,
    //     image: <Image Name>, (string)
    //     name: otpweb.dnp.dappnode.eth, (string)
    //     shortName: otpweb, (string)
    //     version: '0.0.4', (string)
    //     ports: <list of ports>, (string)
    //     state: 'exited', (string)
    //     running: true, (boolean)
    //     ...
    //     envs: <Env variables> (object)
    //   },
    //   ...]
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

function* callApi({ method, kwargs, message }) {
  try {
    const pendingToast = new Toast({ message, pending: true });
    const res = yield call(APIcall[method], kwargs);
    pendingToast.resolve(res);
  } catch (error) {
    console.error("Error on " + method + ": ", error);
  }
}

function shouldUpdate(v1, v2) {
  // currentVersion, newVersion
  v1 = semver.valid(v1) || "999.9.9";
  v2 = semver.valid(v2) || "999.9.9";
  return semver.lt(v1, v2);
}

export function* checkCoreUpdate() {
  try {
    const packagesRes = yield call(APIcall.listPackages);
    const coreDataRes = yield call(APIcall.fetchPackageData, {
      id: "core.dnp.dappnode.eth"
    });

    // Abort on error
    if (!packagesRes.success) {
      console.error("Error listing packages", packagesRes.message);
      return;
    }
    if (!coreDataRes.success) {
      console.error("Error getting coreData", coreDataRes.message);
      return;
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

    yield put({
      type: t.SYSTEM_UPDATE_AVAILABLE,
      systemUpdateAvailable: Boolean(coreDepsToInstall.length)
    });
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

let updatingCore = false;
function* updateCore() {
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
}

function* logPackage({ kwargs }) {
  const { id } = kwargs;
  try {
    const res = yield call(APIcall.logPackage, kwargs);
    if (res.success) {
      const { logs } = res.result || {};
      if (!logs) {
        yield put(a.updateLog("Error, logs missing", id));
      } else if (logs === "") {
        yield put(a.updateLog("Received empty logs", id));
      } else {
        yield put(a.updateLog(logs, id));
      }
    } else {
      yield put(a.updateLog("Error logging package: \n" + res.message, id));
    }
  } catch (e) {
    console.error("Error getting package logs:", e);
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

    yield call(getStaticIp);
  } catch (e) {
    console.error("Error setting static IP:", e);
  }
}

function* getStaticIp() {
  try {
    const res = yield call(APIcall.getVpnParams);
    const { staticIp } = (res || {}).result || {};
    yield put(a.updateStaticIp(staticIp));
  } catch (e) {
    console.error("Error getting static IP:", e);
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchConnectionOpen() {
  yield takeEvery("CONNECTION_OPEN", checkCoreUpdate);
  yield takeEvery("CONNECTION_OPEN", listPackages);
  yield takeEvery("CONNECTION_OPEN", getStaticIp);
}

function* watchCall() {
  yield takeEvery(t.CALL, callApi);
}

function* watchLogPackage() {
  yield takeEvery(t.LOG_PACKAGE, logPackage);
}

function* watchUpdateCore() {
  yield takeEvery(t.UPDATE_CORE, updateCore);
}

function* watchSetStaticIp() {
  yield takeEvery(t.SET_STATIC_IP, setStaticIp);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([
    watchConnectionOpen(),
    watchCall(),
    watchLogPackage(),
    watchUpdateCore(),
    watchSetStaticIp()
  ]);
}
