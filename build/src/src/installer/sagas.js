import { call, put, takeEvery, all, select } from "redux-saga/effects";
import * as APIcall from "API/crossbarCalls";
import * as t from "./actionTypes";
import * as selector from "./selectors";

/***************************** Subroutines ************************************/

export function* install(action) {
  try {
    // Load necessary info
    const id = yield select(selector.selectedPackageId);
    const version = "latest"; // TODO ####
    const isInstalling = yield select(selector.isInstalling);

    // Prevent double installations, 1. check if the package is in the blacklist
    if (isInstalling[id]) {
      return console.error(id + " IS ALREADY INSTALLING");
    }

    // blacklist the current package
    yield put({ type: t.ISINSTALLING, payload: true, id });

    yield call(APIcall.addPackage, {
      id: id + "@" + version
    });
    yield put({ type: t.UPDATE_FETCHING, fetching: false });

    // Remove package from blacklist
    yield put({ type: t.ISINSTALLING, payload: false, id });

    // Fetch directory
    yield call(fetchDirectory);
  } catch (error) {
    console.error("Error installing package: ", error);
  }
}

// After successful installation notify the chain
// chains.actions.installedChain(selectedPackageName)(dispatch, getState);

export function* updateEnvs(action) {
  try {
    const envs = action.env;
    const restart = action.restart;
    const id = yield select(selector.selectedPackageName);
    if (Object.getOwnPropertyNames(envs).length > 0) {
      yield call(APIcall.updatePackageEnv, {
        id,
        envs,
        restart
      });
    }
  } catch (error) {
    console.error("Error Updating envs: ", error);
  }
}

export function* openPorts(action) {
  try {
    const ports = action.ports;
    if (ports.length > 0) {
      yield call(APIcall.openPorts, {
        ports
      });
    }
  } catch (error) {
    console.error("Error opening ports: ", error);
  }
}

// For installer: throttle(ms, pattern, saga, ...args)

export function* fetchDirectory() {
  try {
    yield put({ type: t.UPDATE_FETCHING, fetching: true });
    const directory = yield call(APIcall.fetchDirectory);
    yield put({ type: t.UPDATE_FETCHING, fetching: false });
    // fetchDirectory CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: [{
    //     name,
    //     status
    //   },
    //   ...]

    // Abort on error
    if (!directory) return;

    // Update directory
    yield put({ type: t.UPDATE_DIRECTORY, directory });
    yield all(directory.map(pkg => call(fetchPackageData, pkg)));
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

export function* fetchPackageData(pkg) {
  try {
    // Send basic package info immediately for progressive loading appearance
    yield put({ type: t.UPDATE_PACKAGE, data: pkg, id: pkg.name });
    const packageData = yield call(APIcall.fetchPackageData, {
      id: pkg.name
    });
    // fetchPackageData CALL DOCUMENTATION:
    // > kwargs: { id }
    // > result: {
    //     manifest,
    //     avatar
    //   }
    yield put({ type: t.UPDATE_PACKAGE, data: packageData, id: pkg.name });
  } catch (error) {
    console.error("Error getting package data: ", error);
  }
}

export function* fetchPackageVersions(action) {
  try {
    const versions = yield call(APIcall.fetchPackageVersions, action.kwargs);
    // fetchPackageVersions CALL DOCUMENTATION:
    // > kwargs: { id }
    // > result: [{
    //     version: '0.0.4', (string)
    //     manifest: <Manifest> (object)
    //   },
    //   ...]

    // Abort on error
    if (!versions) return;

    // Update directory
    yield put({
      type: t.UPDATE_PACKAGE,
      data: { versions },
      id: action.kwargs.id
    });
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchFetchDirectory() {
  yield takeEvery(t.FETCH_DIRECTORY, fetchDirectory);
}

function* watchFetchPackageVersions() {
  yield takeEvery(t.FETCH_PACKAGE_VERSIONS, fetchPackageVersions);
}

function* watchInstall() {
  yield takeEvery(t.INSTALL, install);
}

function* watchUpdateEnvs() {
  yield takeEvery(t.UPDATE_ENV, updateEnvs);
}

function* watchOpenPorts() {
  yield takeEvery(t.OPEN_PORTS, openPorts);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([
    watchFetchDirectory(),
    watchInstall(),
    watchUpdateEnvs(),
    watchOpenPorts(),
    watchFetchPackageVersions()
  ]);
}
