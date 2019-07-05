import { call, put, select } from "redux-saga/effects";
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
import { getIsInstallingByDnp } from "services/isInstallingLogs/selectors";
// Utils
import { rootWatcher, assertAction, assertConnectionOpen } from "utils/redux";
import { shortName } from "utils/format";
import isSyncing from "utils/isSyncing";
import isIpfsHash from "utils/isIpfsHash";
import isEnsDomain from "utils/isEnsDomain";
import uniqArray from "utils/uniqArray";
import Joi from "joi";

/***************************** Subroutines ************************************/

export function* install({ id, options }) {
  try {
    // Prevent double installations: check if the package is in the blacklist
    if (yield select(getIsInstallingByDnp, id)) {
      return console.error(`DAppNode Package ${id} is already installing`);
    }

    // Deal with IPFS DNP by retrieving the actual DNP
    const dnp = yield select(getDnpDirectoryById, id);
    let idToInstall;
    if (isIpfsHash(id)) {
      if (!dnp || !dnp.name)
        throw Error(`No DAppNode Package found for IPFS hash ${id}`);
      idToInstall = `${dnp.name}@${id}`;
    } else if (isEnsDomain(id)) {
      idToInstall = id;
    } else {
      throw Error(
        `id to install: "${id}" must be an ENS domain or an IPFS hash`
      );
    }

    // Blacklist the current package, via starting the isInstallingLog
    yield put(
      updateIsInstallingLog({
        id: idToInstall,
        dnpName: idToInstall.split("@")[0],
        log: "Starting..."
      })
    );

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
    const toastMessage = `Adding ${shortName(idToInstall)}...`;
    yield call(
      api.installPackage,
      { id: idToInstall, ...userSetFormatted, options },
      { toastMessage }
    );

    // Clear progressLogs, + Removes DNP from blacklist
    yield put(clearIsInstallingLogsById(idToInstall));

    // Fetch directory
    yield put(actionFetchDnpDirectory);
  } catch (e) {
    console.error(`Error on install(${id}): ${e.stack}`);
  }
}

/**
 *
 * @param {object} kwargs { ports:
 *   [ { portNumber: 30303, protocol: TCP }, ...]
 * }
 */
export function* managePorts({ action, ports = [] }) {
  try {
    assertAction(
      action,
      Joi.object({
        action: Joi.string().required(),
        ports: Joi.any().required() // ##### TODO
      })
    );
    // Remove duplicates
    ports = uniqArray(ports);
    // Only open ports if necessary
    const upnpAvailable = yield select(getUpnpAvailable);
    if (upnpAvailable && ports.length > 0) {
      const toastMessage = `${action} ports ${ports
        .map(p => `${p.portNumber} ${p.protocol}`)
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
    try {
      const { state, alreadyUpdated } = yield call(api.resolveRequest, {
        req: { name, ver: isIpfsHash(id) ? id : version }
      });
      const dnps = { ...(state || {}), ...(alreadyUpdated || {}) };
      yield put(
        updateDnpDirectoryById(id, {
          resolving: false,
          requestResult: { dnps, error: null }
        })
      );
      // Fetch package data of the dependencies. fetchPackageData updates the store
      for (const [depName, depVersion] of Object.entries(state)) {
        if (depName === name) continue; // Don't refetch requested DNP
        yield put(a.fetchPackageData(`${depName}@${depVersion}`));
      }
    } catch (e) {
      // if api.resolveRequest fails, it will throw. Display this error in the UI
      yield put(
        updateDnpDirectoryById(id, {
          resolving: false,
          requestResult: { error: e.message }
        })
      );
    }
  } catch (e) {
    console.error(`Èrror on fetchPackageRequest(${id}): ${e.stack}`);
  }
}

/**
 * [dontLogError] Is a special feature so the UI can instruct the DAPPMANAGER to
 * suppress noisy errors on recurring calls.
 * This is necessary for the fetchPackageData while the user is typing a name} param0
 */
export function* fetchPackageData({ id, dontLogError }) {
  try {
    // If connection is not open yet, wait for it to open.
    yield call(assertConnectionOpen);
    const { manifest, avatar } = yield call(api.fetchPackageData, {
      id,
      ...(dontLogError ? { dontLogError } : {})
    });
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
