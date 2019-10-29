import { call, put, select } from "redux-saga/effects";
import api from "API/rpcMethods";
import * as t from "./actionTypes";
// Actions
import { fetchDnpDirectory as actionFetchDnpDirectory } from "services/dnpDirectory/actions";
import {
  clearIsInstallingLog,
  updateIsInstallingLog
} from "services/isInstallingLogs/actions";
// Selectors
import { getUpnpAvailable } from "services/dappnodeStatus/selectors";
import { getProgressLogsByDnp } from "services/isInstallingLogs/selectors";
// Utils
import { rootWatcher, assertAction, assertConnectionOpen } from "utils/redux";
import { shortName } from "utils/format";
import isSyncing from "utils/isSyncing";
import isIpfsHash from "utils/isIpfsHash";
import uniqArray from "utils/uniqArray";
import Joi from "joi";
import { stringIncludes } from "utils/strings";

/***************************** Subroutines ************************************/

export function* install({ name, version, userSetFormData, options }) {
  try {
    // Prevent double installations: check if the package is in the blacklist
    const progressLogsByDnp = yield select(getProgressLogsByDnp);
    if (progressLogsByDnp[name])
      return console.error(`DAppNode Package ${name} is already installing`);

    const id = version ? `${name}@${version}` : name;

    // Blacklist the current package, via starting the isInstallingLog
    yield put(updateIsInstallingLog({ id, dnpName: name, log: "Starting..." }));

    // Fire call
    const toastMessage = `Adding ${shortName(name)}...`;
    yield call(
      api.installPackage,
      { id, userSet: userSetFormData, options },
      { toastMessage }
    );

    // Clear progressLogs, + Removes DNP from blacklist
    yield put(clearIsInstallingLog({ id }));

    // Fetch directory
    yield put(actionFetchDnpDirectory);
  } catch (e) {
    console.error(`Error on install(${name}): ${e.stack}`);
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
    if (!stringIncludes(id, "ipfs/")) {
      if (yield call(isSyncing)) {
        return yield put({ type: "UPDATE_IS_SYNCING", isSyncing: true });
      }
    }

    // If package is already loaded, skip
    /**
     * - Check if the DNP is already loaded in the directory
     * - If not, request its manifest to the DAPPMANAGER
     * - If still there is no manifest, throw
     */
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
    const { manifest } = yield call(api.fetchPackageData, {
      id,
      ...(dontLogError ? { dontLogError } : {})
    });
    if (!manifest) {
      throw Error(`Missing manifest for fetchPackageData: ${id}`);
    }
    // Add ipfs hash inside the manifest too, so it is searchable
    if (manifest) manifest.origin = isIpfsHash(id) ? id : null;
    // Update directory
  } catch (e) {
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
