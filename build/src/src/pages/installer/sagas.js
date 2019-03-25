import { call, put, select, all } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import * as s from "./selectors";
import uuidv4 from "uuid/v4";
import { shortName } from "utils/format";
import isSyncing from "utils/isSyncing";
import { idToUrl, isIpfsHash } from "./utils";
import uniqArray from "utils/uniqArray";
import assertConnectionOpen from "utils/assertConnectionOpen";
import { fetchDnpDirectory as actionFetchDnpDirectory } from "services/dnpDirectory/actions";

/***************************** Subroutines ************************************/

export function* install({ id, options }) {
  try {
    // Load necessary info
    const isInstalling = yield select(s.isInstalling);
    // Prevent double installations, 1. check if the package is in the blacklist
    if (isInstalling[id]) {
      return console.error(`DNP ${id} is already installing`);
    }
    const logId = uuidv4();

    // blacklist the current package
    yield put({
      type: "installer/PROGRESS_LOG",
      logId,
      msg: "Fetching dependencies...",
      pkgName: id.split("@")[0]
    });

    // Prepare call data
    // ##### The by package notation is a forward compatibility
    // ##### to suppport setting dependencies' port / vol
    //  userSetEnvs = {
    //    "kovan.dnp.dappnode.eth": {
    //      "ENV_NAME": "VALUE1"
    //    }, ... }
    //  userSetVols = "kovan.dnp.dappnode.eth": {
    //      "old_path:/root/.local": "new_path:/root/.local"
    //    }, ... }
    //  userSetPorts = {
    //    "kovan.dnp.dappnode.eth": {
    //      "30303": "31313:30303",
    //      "30303/udp": "31313:30303/udp"
    //    }, ... }
    const userSetEnvs = yield select(s.getUserSetEnvs);
    const userSetPorts = yield select(s.getUserSetPortsStringified);
    const userSetVols = yield select(s.getUserSetVolsStringified);

    // Fire call
    const toastMessage = `Adding ${shortName(id)}...`;
    yield call(
      APIcall.installPackage,
      {
        id,
        userSetEnvs,
        userSetVols,
        userSetPorts,
        logId,
        options
      },
      { toastMessage }
    );

    // Remove package from blacklist
    yield put({ type: t.CLEAR_PROGRESS_LOG, logId });

    // Fetch directory
    yield put(actionFetchDnpDirectory);
  } catch (error) {
    console.error("Error installing package: ", error);
  }
}

function getDefaultEnvs(manifest) {
  const envsArray = ((manifest || {}).image || {}).environment || [];
  const defaultEnvs = {};
  for (const row of envsArray) {
    defaultEnvs[row.split("=")[0]] = row.split("=")[1] || "";
  }
  return defaultEnvs;
}

// Will set the default envs for a given package
// ONLY IF IT'S NOT INSTALLED
export function* updateDefaultEnvs({ id }) {
  try {
    const res = yield call(APIcall.fetchPackageData, { id });
    if (!res.success) {
      if (res.message.includes("Resolver could not")) {
        console.error("No match found for " + id);
      } else {
        console.error(
          "Error fetching package data for updateDefaultEnvs: ",
          res.message
        );
      }
      return;
    }
    const { manifest } = res.result || {};
    if (!manifest) {
      throw Error("Missing manifest for updateDefaultEnvs: ", { id, res });
    }

    // Omit if the package is already installed
    const packageName = manifest.name;
    const installedPackages = yield select(state => state.installedPackages);
    const isInstalled = installedPackages.find(p => p.name === packageName);
    if (isInstalled) {
      console.log(
        `Omitting updateDefaultEnvs for ${id} as DNP ${packageName} is already installed`
      );
      return;
    }

    // Compute the default envs
    const envs = getDefaultEnvs(manifest);
    yield call(updateEnvs, { id, envs });
  } catch (e) {
    console.error("Error updating default envs: ", e);
  }
}

export function* updateEnvs({ id, envs, isCORE, restart }) {
  try {
    if (Object.getOwnPropertyNames(envs).length > 0) {
      const toastMessage = `Updating ${id} ${
        isCORE ? "(core)" : ""
      } envs: ${JSON.stringify(envs)}`;
      yield call(
        APIcall.updatePackageEnv,
        {
          id,
          envs,
          isCORE,
          restart
        },
        { toastMessage }
      );
    }
  } catch (error) {
    console.error("Error updating " + id + "envs: ", error);
  }
}

/**
 *
 * @param {Object} kwargs { ports:
 *   [ { number: 30303, type: TCP }, ...]
 * }
 */
export function* managePorts({ action, ports = [] }) {
  try {
    if (!Array.isArray(ports)) throw Error("ports must be an array");
    // Remove duplicates
    ports = uniqArray(ports);
    // Only open ports if necessary
    const shouldOpenPorts = yield select(s.getShouldOpenPorts);
    if (shouldOpenPorts && ports.length > 0) {
      const toastMessage = `${action} ports ${ports
        .map(p => `${p.number} ${p.type}`)
        .join(", ")}...`;
      yield call(APIcall.managePorts, { action, ports }, { toastMessage });
    }
  } catch (error) {
    console.error(`Error on ${action} ports: `, error);
  }
}

export function* fetchPackageRequest({ id }) {
  try {
    // If connection is not open yet, wait for it to open.
    yield call(assertConnectionOpen);

    // If chain is not synced yet, cancel request.
    if (id && !id.includes("ipfs/")) {
      if (yield call(isSyncing)) {
        return yield put({ type: "UPDATE_IS_SYNCING", isSyncing: true });
      }
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
    const requestResult = yield call(APIcall.resolveRequest, {
      req: { name, ver: isIpfsHash(id) ? id : version }
    });
    yield put(a.updateFetchingRequest(id, false));
    yield put({
      type: "UPDATE_DIRECTORY",
      pkgs: { [id]: { requestResult } }
    });

    // Fetch package data of the dependencies
    const dnps = Object.assign({}, (requestResult || {}).success || {});
    delete dnps[name]; // Ignore requested package
    // fetchPackageData will automatically update the store
    yield all(
      Object.keys(dnps).map(depName =>
        call(fetchPackageData, {
          id: `${depName}@${dnps[depName]}`
        })
      )
    );
  } catch (error) {
    console.error("Error getting package data: ", error);
  }
}

export function* fetchPackageData({ id }) {
  try {
    // If connection is not open yet, wait for it to open.
    yield call(assertConnectionOpen);
    const { manifest, avatar } = yield call(APIcall.fetchPackageData, { id });
    if (!manifest) {
      throw Error(`Missing manifest for fetchPackageData: ${id}`);
    }
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
    console.error("Error fetching package data: ", error);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [t.UPDATE_DEFAULT_ENVS, updateDefaultEnvs],
  [t.FETCH_PACKAGE_DATA, fetchPackageData],
  [t.FETCH_PACKAGE_REQUEST, fetchPackageRequest],
  [t.INSTALL, install],
  [t.UPDATE_ENV, updateEnvs],
  [t.MANAGE_PORTS, managePorts]
];

export default rootWatcher(watchers);
