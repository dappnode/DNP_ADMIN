import { put, call, select } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
// Actions
import * as actions from "./actions";
import {
  updateIsLoading,
  updateIsLoaded
} from "services/loadingStatus/actions";
import { connectionOpen } from "services/connectionStatus/actions";
import { clearIsInstallingLog } from "services/isInstallingLogs/actions";
// Utilities
import { CoreUpdateData } from "types";
import { updateCoreUpdateData, updateUpdatingCore } from "./actions";
import { getUpdatingCore } from "./selectors";
import { withToast } from "components/toast/Toast";
import { coreName } from "params";
import * as loadingIds from "services/loadingStatus/loadingIds";

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

declare global {
  interface Window {
    setCoreVersion: (version: string) => string;
    restoreCoreId: () => string;
  }
}

const coreVersionLocalStorageTag = "DEVONLY-core-version";
const coreVersionDevSet = localStorage.getItem(coreVersionLocalStorageTag);
// Methods to edit the coreID
window.setCoreVersion = (version: string) => {
  localStorage.setItem(coreVersionLocalStorageTag, version);
  return `Set core version to version ${version}`;
};
window.restoreCoreId = () => {
  localStorage.removeItem(coreVersionLocalStorageTag);
  return `Deleted custom DEVONLY core version setting`;
};

const coreVersion = coreVersionDevSet || undefined;

/***************************** Subroutines ************************************/

/**
 * Does a call to `api.resolveRequest` with `id = core.dnp.dappnode.eth@latest`
 * to know if there is an update available. If so, it fetches the manifests
 * of the core DNP and all the necessary dependencies
 */
export function* checkCoreUpdate() {
  try {
    console.log("Check core update");
    // If chain is not synced yet, cancel request.
    yield put(updateIsLoading(loadingIds.coreUpdate));

    const coreUpdateData: CoreUpdateData = yield call(api.fetchCoreUpdateData, {
      version: coreVersion
    });
    yield put(updateCoreUpdateData(coreUpdateData));

    yield put(updateIsLoaded(loadingIds.coreUpdate));

    /* Log out current state */
    console.log(
      `DAppNode ${coreName} (${coreUpdateData.versionId})`,
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
    if (yield select(getUpdatingCore)) {
      return console.error("Error: DAppNode core is already updating");
    }

    // blacklist the current package
    yield put(updateUpdatingCore(true));

    yield call(async function() {
      await withToast(
        () =>
          api.installPackage({
            name: coreName,
            version: coreVersion,
            options: { BYPASS_CORE_RESTRICTION: true, BYPASS_RESOLVER: true }
          }),
        {
          message: "Updating DAppNode core...",
          onSuccess: "Updated DAppNode core"
        }
      );
    });
    // Remove package from blacklist
    yield put(updateUpdatingCore(false));

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
  [connectionOpen.toString(), checkCoreUpdate],
  [actions.updateCore.toString(), updateCore]
]);
