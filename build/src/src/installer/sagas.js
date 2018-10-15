import { call, put, takeEvery, all, select, take } from "redux-saga/effects";
import * as APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import * as s from "./selectors";
import uuidv4 from "uuid/v4";
import Toast from "components/Toast";
import { shortName } from "utils/format";
import isSyncing from "utils/isSyncing";
import { idToUrl, isIpfsHash } from "./utils";

/***************************** Subroutines ************************************/

export function* shouldOpenPorts() {
  const res = yield call(APIcall.getStatusUpnp);
  if (res.success) {
    yield put({
      type: t.SHOULD_OPEN_PORTS,
      shouldOpenPorts: res.result.openPorts && res.result.upnpAvailable
    });
  } else {
    console.error("Error fetching UPnP status: " + res.message);
  }
}

export function* install({ id, vols, options }) {
  try {
    // Load necessary info
    const isInstalling = yield select(s.isInstalling);
    // Prevent double installations, 1. check if the package is in the blacklist
    if (isInstalling[id]) {
      return console.error(id + " IS ALREADY INSTALLING");
    }
    const logId = uuidv4();
    const pendingToast = new Toast({
      message: "Adding " + shortName(id) + "...",
      pending: true
    });
    // blacklist the current package
    yield put({
      type: "installer/PROGRESS_LOG",
      logId,
      msg: "Fetching dependencies...",
      pkgName: id.split("@")[0]
    });
    const res = yield call(APIcall.installPackage, {
      id,
      vols,
      logId,
      options
    });
    // Remove package from blacklist
    yield put({ type: t.CLEAR_PROGRESS_LOG, logId });
    pendingToast.resolve(res);
    // Fetch directory
    yield call(fetchDirectory);
  } catch (error) {
    console.error("Error installing package: ", error);
  }
}

// After successful installation notify the chain
// chains.actions.installedChain(selectedPackageName)(dispatch, getState);

export function* updateEnvs({ id, envs, restart }) {
  try {
    if (Object.getOwnPropertyNames(envs).length > 0) {
      const pendingToast = new Toast({
        message: "Updating " + id + " envs: " + JSON.stringify(envs),
        pending: true
      });
      const res = yield call(APIcall.updatePackageEnv, {
        id,
        envs,
        restart
      });
      pendingToast.resolve(res);
    }
  } catch (error) {
    console.error("Error updating " + id + "envs: ", error);
  }
}

export function* openPorts({ ports }) {
  try {
    const shouldOpenPorts = yield select(s.shouldOpenPorts);
    if (shouldOpenPorts && ports.length > 0) {
      // #### Only if necessary!!!
      const pendingToast = new Toast({
        message: "Opening ports " + ports.join(", ") + "...",
        pending: true
      });
      const res = yield call(APIcall.managePorts, {
        action: "open",
        ports
      });
      pendingToast.resolve(res);
    }
  } catch (error) {
    console.error("Error opening ports: ", error);
  }
}

export function* fetchDirectory() {
  try {
    // If chain is not synced yet, cancel request.
    if (yield call(isSyncing)) {
      return yield put({type: "UPDATE_IS_SYNCING", isSyncing: true});
    }

    yield put({ type: t.UPDATE_FETCHING, fetching: true });
    const res = yield call(APIcall.fetchDirectory);
    yield put({ type: t.UPDATE_FETCHING, fetching: false });
    if (!res.success) {
      return new Toast(res);
    }

    // Storing the result anyway in case the DAPPMANAGER is old
    const directory = yield select(state => state.directory);
    if (!Object.getOwnPropertyNames(directory).length) {
      if (res.result && Array.isArray(res.result)) {
        // Now the directory needs to be an object
        const pkgs = {};
        for (const pkg of res.result) {
          pkgs[pkg.name] = pkg;
        }
        yield put({ type: "UPDATE_DIRECTORY", pkgs });
      } else if (res.result && typeof res.result === "object") {
        const pkgs = directory;
        yield put({ type: "UPDATE_DIRECTORY", pkgs });
      }
    }

    /**
     * The data is received through progressive websocket events
     * in API/socketSubscription.js
     */
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

export function* fetchPackageRequest({ id }) {
  try {
    // If connection is not open yet, wait for it to open.
    const connectionOpen = yield select(s.connectionOpen);
    if (!connectionOpen) {
      yield take("CONNECTION_OPEN");
    }
    // If chain is not synced yet, cancel request.
    if(yield call(isSyncing)) {
      return yield put({type: "UPDATE_IS_SYNCING", isSyncing: true});
    }

    // If package is already loaded, skip
    const directory = yield select(s.getDirectory);
    const pkg = directory[id];
    let manifest;
    if (!pkg) {
      yield put(a.updateFetching(true));
      manifest = yield call(fetchPackageData, { id });
      yield put(a.updateFetching(false));
      // If the package was not resolved, cancel
      if (!manifest) {
        return;
      }
    } else {
      manifest = pkg.manifest;
    }

    // Stop request if manifest is not defined
    if (!manifest) {
      throw Error(
        "Cannot resolve request of " +
          id +
          ", manifest not defined \n This maybe due to an outdated version of DNP_DAPPMANAGER. " +
          "Please update your system: https://github.com/dappnode/DAppNode/wiki/DAppNode-Installation-Guide#3-how-to-restore-an-installed-dappnode-to-the-latest-version"
      );
    }

    // Resolve the request to install

    const { name, version } = manifest;
    yield put(a.updateFetchingRequest(id, true));
    const res = yield call(APIcall.resolveRequest, {
      req: { name, ver: isIpfsHash(id) ? id : version }
    });
    yield put(a.updateFetchingRequest(id, false));

    if (res.success) {
      yield put({
        type: "UPDATE_DIRECTORY",
        pkgs: { [id]: { requestResult: res.result } }
      });
    } else {
      console.error("Error resolving dependencies of " + id, res.message);
      return;
    }
  } catch (error) {
    console.error("Error getting package data: ", error);
  }
}

export function* fetchPackageData({ id }) {
  try {
    // If connection is not open yet, wait for it to open.
    const connectionOpen = yield select(s.connectionOpen);
    if (!connectionOpen) {
      yield take("CONNECTION_OPEN");
    }
    const res = yield call(APIcall.fetchPackageData, { id });
    // Abort on error
    if (!res.success) {
      if (res.message.includes("Resolver could not found a match")) {
        console.error("No match found for " + id);
      } else {
        console.error("Error fetching package data: ", res.message);
      }
      return;
    }
    const { manifest, avatar } = res.result || {};
    // Add ipfs hash inside the manifest too, so it is searchable
    if (manifest) manifest.origin = isIpfsHash(id) ? id : null;
    // Update directory
    yield put({
      type: "UPDATE_DIRECTORY",
      pkgs: {
        [id]: {
          name: manifest.name,
          manifest,
          avatar,
          origin: isIpfsHash(id) ? id : null,
          url: idToUrl(id)
        }
      }
    });
    return manifest;
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

function* diskSpaceAvailable({ path }) {
  try {
    // If connection is not open yet, wait for it to open.
    const connectionOpen = yield select(s.connectionOpen);
    if (!connectionOpen) {
      yield take("CONNECTION_OPEN");
    }
    const res = yield call(APIcall.diskSpaceAvailable, { path });
    // Abort on error
    if (!res.success) {
      console.error("Disk space available returned error: ", res.message);
    }

    const { exists, totalSize, availableSize } = res.result;
    yield put({
      type: t.UPDATE_DISK_SPACE_AVAILABLE,
      status: exists ? `${availableSize} / ${totalSize}` : `non-existent`,
      path
    });
  } catch (error) {
    console.error(
      "Error getting disk space available of " + path + ": ",
      error
    );
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchConnectionOpen() {
  yield takeEvery("CONNECTION_OPEN", fetchDirectory);
  yield takeEvery("CONNECTION_OPEN", shouldOpenPorts);
}

function* watchFetchPackageData() {
  yield takeEvery(t.FETCH_PACKAGE_DATA, fetchPackageData);
}

function* watchFetchPackageRequest() {
  yield takeEvery(t.FETCH_PACKAGE_REQUEST, fetchPackageRequest);
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

function* watchDiskSpaceAvailable() {
  yield takeEvery(t.DISK_SPACE_AVAILABLE, diskSpaceAvailable);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([
    watchConnectionOpen(),
    watchInstall(),
    watchUpdateEnvs(),
    watchOpenPorts(),
    watchFetchPackageRequest(),
    watchFetchPackageData(),
    watchDiskSpaceAvailable()
  ]);
}
