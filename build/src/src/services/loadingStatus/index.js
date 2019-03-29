import * as selectors from "./selectors";
import reducer from "./reducer";
import { mountPoint } from "./data";

/**
 * Service > loadingStatus
 *
 * Tracks the loading status by a given ID.
 * When sagas load important content, they should call:
 *
 *   const loadingId = "devices"
 *   // Use a variable to ensure consistency
 *   yield put(updateIsLoading(loadingId));
 *   const data = yield call(api);
 *   yield put(a.updateDevices(devices));
 *
 * Assists the `withLoadingStatus` HOC
 *
 * [Tested]
 */

export default {
  mountPoint,
  selectors,
  reducer
};
