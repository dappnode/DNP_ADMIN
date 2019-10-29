import { put, call, select } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import api from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import * as s from "./selectors";
import { loadingId, coreName } from "./data";
// Actions
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";
import { pushNotification } from "services/notifications/actions";
import { clearIsInstallingLog } from "services/isInstallingLogs/actions";
// Utilities
import isSyncing from "utils/isSyncing";

// Service > coreUpdate

/**
 * To modify the core version for DEV ONLY purposes, do
 *   localStorage.setItem('DEVONLY-core-id', 'core.dnp.dappnode.eth@/ipfs/Qm5sxx...');
 *    or
 *   setCoreIdIpfs('/ipfs/Qm5sxx...')
 *    or
 *   setCoreId('core.dnp.dappnode.eth@0.1.1')
 *    then
 *   restoreCoreId()
 * And refresh the page
 */

const coreVersionLocalStorageTag = "DEVONLY-core-version";
const coreVersionDevSet = localStorage.getItem(coreVersionLocalStorageTag);
// Methods to edit the coreID
window.setCoreVersion = version => {
  localStorage.setItem(coreVersionLocalStorageTag, version);
  return `Set core version to version ${version}`;
};
window.restoreCoreId = () => {
  localStorage.removeItem(coreVersionLocalStorageTag);
  return `Deleted custom DEVONLY core version setting`;
};

const coreVersion = coreVersionDevSet || "latest";
const coreId = [coreName, coreVersion].join("@");

/***************************** Subroutines ************************************/

function* putMainnetIsStillSyncing() {
  try {
    yield put({ type: "UPDATE_IS_SYNCING", isSyncing: true });
    yield put(
      pushNotification({
        id: "mainnetStillSyncing",
        type: "warning",
        title: "Mainnet is still syncing",
        body:
          "Ethereum mainnet is still syncing. Until complete syncronization you will not be able to navigate to decentralized websites or install packages via .eth names."
      })
    );
  } catch (e) {
    console.error(`Error putting mainnet is still syncing: ${e.stack}`);
  }
}

/**
 * Does a call to `api.resolveRequest` with `id = core.dnp.dappnode.eth@latest`
 * to know if there is an update available. If so, it fetches the manifests
 * of the core DNP and all the necessary dependencies
 */
export function* checkCoreUpdate() {
  try {
    // If chain is not synced yet, cancel request.
    if (yield call(isSyncing)) {
      return yield call(putMainnetIsStillSyncing);
    }
    yield put(updateIsLoading(loadingId));

    /**
     * @param {object} result = {
     *   available: true {bool},
     *   type: "minor",
     *   packages: [
     *     {
     *       name: "core.dnp.dappnode.eth",
     *       from: "0.2.5",
     *       to: "0.2.6",
     *       manifest: {}
     *     },
     *     {
     *       name: "admin.dnp.dappnode.eth",
     *       from: "0.2.2",
     *       to: "0.2.3",
     *       manifest: {}
     *     }
     *   ],
     *   changelog: "Changelog text",
     *   updateAlerts: [{ message: "Specific update alert"}, ... ],
     *   versionId: "admin@0.2.6,core@0.2.8"
     * }
     */
    const coreUpdateData = yield call(api.fetchCoreUpdateData);
    yield put(a.updateCoreUpdateData(coreUpdateData));

    yield put(updateIsLoaded(loadingId));

    /* Log out current state */
    console.log(
      `DAppNode ${coreId} (${coreUpdateData.versionId})`,
      coreUpdateData
    );
  } catch (e) {
    console.error(`Error on checkCoreUpdate: ${e.stack}`);
  }
}

/**
 * Calls `api.install` to update the DAppNode core.
 * - Has a protection to prevent double updates.
 * - Calls checkCoreUpdate afterwards to refresh the warnings that there is an update available
 */

function* updateCore() {
  try {
    // Prevent double installations
    if (yield select(s.getUpdatingCore)) {
      return console.error("Error: DAppNode core is already updating");
    }

    // blacklist the current package
    yield put(a.updateUpdatingCore(true));

    yield call(
      api.installPackageSafe,
      { id: coreId, options: { BYPASS_CORE_RESTRICTION: true } },
      { toastMessage: "Updating DAppNode core..." }
    );
    // Remove package from blacklist
    yield put(a.updateUpdatingCore(false));

    // Clear progressLogs, + Removes DNP from blacklist
    yield put(clearIsInstallingLog({ id: coreName }));

    // Call checkCoreUpdate to compute hide the "Update" warning and buttons
    yield call(checkCoreUpdate);
  } catch (e) {
    console.error(`Error on updateCore: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  [CONNECTION_OPEN, checkCoreUpdate],
  [t.UPDATE_CORE, updateCore]
]);
