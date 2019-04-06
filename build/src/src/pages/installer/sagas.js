import { call, put, select } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import api from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import * as s from "./selectors";
// Actions
import { fetchDnpDirectory as actionFetchDnpDirectory } from "services/dnpDirectory/actions";
import { updateDnpDirectoryById } from "services/dnpDirectory/actions";
import {
  clearIsInstallingLogsById,
  updateIsInstallingLog
} from "services/isInstallingLogs/actions";
// Selectors
import { getUpnpAvailable } from "services/dappnodeStatus/selectors";
import { getDnpDirectoryById } from "services/dnpDirectory/selectors";
// Utils
import { assertAction, assertConnectionOpen } from "utils/redux";
import { shortName } from "utils/format";
import isSyncing from "utils/isSyncing";
import { isIpfsHash } from "./utils";
import uniqArray from "utils/uniqArray";

/***************************** Subroutines ************************************/

export function* install({ id, options }) {
  try {
    // Prevent double installations: check if the package is in the blacklist
    if (yield select(s.getIsInstallingById, id)) {
      return console.error(`DNP ${id} is already installing`);
    }

    // Blacklist the current package, via starting the isInstallingLog
    yield put(updateIsInstallingLog(id, "Starting...", id));

    /**
     * Formats userSet parameters to be send to the dappmanager
     * userSetFormatted = {
     *   userSetEnvs = {
     *     "kovan.dnp.dappnode.eth": {
     *       "ENV_NAME": "VALUE1"
     *     }, ... },
     *   userSetVols = "kovan.dnp.dappnode.eth": {
     *      "old_path:/root/.local": "new_path:/root/.local"
     *    }, ... },
     *   userSetPorts = {
     *    "kovan.dnp.dappnode.eth": {
     *      "30303": "31313:30303",
     *      "30303/udp": "31313:30303/udp"
     *   }, ... }
     * }
     */
    const userSetFormatted = yield select(s.getUserSetFormatted);

    // Fire call
    const toastMessage = `Adding ${shortName(id)}...`;
    yield call(
      api.installPackage,
      { id, ...userSetFormatted, options },
      { toastMessage }
    );

    // Clear progressLogs, + Removes DNP from blacklist
    yield put(clearIsInstallingLogsById(id));

    // Fetch directory
    yield put(actionFetchDnpDirectory);
  } catch (e) {
    console.error(`Error on install(${id}): ${e.stack}`);
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
    assertAction(action, { action: "open", ports: [] });
    // Remove duplicates
    ports = uniqArray(ports);
    // Only open ports if necessary
    const upnpAvailable = yield select(getUpnpAvailable);
    if (upnpAvailable && ports.length > 0) {
      const toastMessage = `${action} ports ${ports
        .map(p => `${p.number} ${p.type}`)
        .join(", ")}...`;
      yield call(api.managePorts, { action, ports }, { toastMessage });
    }
  } catch (e) {
    console.error(`Error on managePorts(${action}): ${e.stack}`);
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

    yield put(updateDnpDirectoryById(id, { loading: true }));

    // If package is already loaded, skip
    /**
     * - Check if the DNP is already loaded in the directory
     * - If not, request its manifest to the DAPPMANAGER
     * - If still there is no manifest, throw
     */
    const dnp = yield select(getDnpDirectoryById, id);
    let manifest = (dnp || {}).manifest;
    if (!manifest) manifest = yield call(fetchPackageData, { id });
    yield put(updateDnpDirectoryById(id, { loading: false }));
    // Stop request if manifest is not defined
    if (!manifest) {
      throw Error(
        "Manifest is not defined. This maybe due to an outdated version of DNP_DAPPMANAGER. Please update your system: https://github.com/dappnode/DAppNode/wiki/DAppNode-Installation-Guide#3-how-to-restore-an-installed-dappnode-to-the-latest-version"
      );
    }

    // Resolve the request to install
    const { name, version } = manifest;
    yield put(updateDnpDirectoryById(id, { resolving: true }));
    const requestResult = yield call(api.resolveRequest, {
      req: { name, ver: isIpfsHash(id) ? id : version }
    });
    yield put(updateDnpDirectoryById(id, { resolving: false, requestResult }));

    // Fetch package data of the dependencies. fetchPackageData updates the store
    const deps = (requestResult || {}).success || {};
    for (const depName of Object.keys((requestResult || {}).success || {})) {
      if (depName === name) continue; // Don't refetch requested DNP
      yield put(a.fetchPackageData(`${depName}@${deps[depName]}`));
    }
  } catch (e) {
    console.error(`Èrror on fetchPackageRequest(${id}): ${e.stack}`);
  }
}

export function* fetchPackageData({ id }) {
  try {
    // If connection is not open yet, wait for it to open.
    yield call(assertConnectionOpen);
    const { manifest, avatar } = yield call(api.fetchPackageData, { id });
    if (!manifest) {
      throw Error(`Missing manifest for fetchPackageData: ${id}`);
    }
    // Add ipfs hash inside the manifest too, so it is searchable
    if (manifest) manifest.origin = isIpfsHash(id) ? id : null;
    // Update directory
    yield put(
      updateDnpDirectoryById(id, {
        name: manifest.name,
        manifest,
        avatar,
        origin: isIpfsHash(id) ? id : null,
        url: encodeURIComponent(id)
      })
    );
    return manifest;
  } catch (e) {
    try {
      yield put(updateDnpDirectoryById(id, { error: e.message }));
    } catch (e) {
      console.error(`Error on fetchPackageData catch block: ${e.stack} `);
    }
    console.error(`Error on fetchPackageData(${id}): ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [t.FETCH_PACKAGE_DATA, fetchPackageData],
  [t.FETCH_PACKAGE_REQUEST, fetchPackageRequest],
  [t.INSTALL, install],
  [t.MANAGE_PORTS, managePorts]
];

export default rootWatcher(watchers);
