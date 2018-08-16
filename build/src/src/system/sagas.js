import { call, put, takeEvery, all } from "redux-saga/effects";
import * as APIcall from "API/crossbarCalls";
import * as t from "./actionTypes";
import * as actions from "./actions";
import semver from "semver";

/***************************** Subroutines ************************************/

export function* listPackages() {
  try {
    const packages = yield call(APIcall.listPackages);
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

    // Abort on error
    if (!packages) return;

    // Update packages
    yield put(actions.updatePackages(packages));
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

function* callApi(action) {
  try {
    yield call(APIcall[action.call], action.kwargs);
  } catch (error) {
    console.error("Error on " + action.call + ": ", error);
  }
  yield call(listPackages);
}

function shouldUpdate(v1, v2) {
  // currentVersion, newVersion
  v1 = semver.valid(v1) || "999.9.9";
  v2 = semver.valid(v2) || "999.9.9";
  return semver.lt(v1, v2);
}

export function* checkCoreUpdate() {
  try {
    const packages = yield call(APIcall.listPackages);
    const coreData = yield call(APIcall.fetchPackageData, {
      id: "core.dnp.dappnode.eth"
    });

    // Abort on error
    if (!packages || !coreData) return;

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

function* updateCore() {
  yield call(APIcall.addPackage, {
    id: "core.dnp.dappnode.eth"
  });
  yield call(checkCoreUpdate);
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchListPackages() {
  yield takeEvery(t.LIST_PACKAGES, listPackages);
}

function* watchCall() {
  yield takeEvery(t.CALL, callApi);
}

function* watchConnectionOpen() {
  yield takeEvery("CONNECTION_OPEN", checkCoreUpdate);
}

function* watchUpdateCore() {
  yield takeEvery(t.UPDATE_CORE, updateCore);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([
    watchListPackages(),
    watchCall(),
    watchConnectionOpen(),
    watchUpdateCore()
  ]);
}
