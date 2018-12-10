import { put, call, select } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import * as APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";
import * as selector from "./selectors";

function* fetchVpnParams() {
  try {
    const res = yield call(APIcall.getVpnParams);
    if (res.success) {
      const result = res.result || {};
      yield put(
        a.updateDappnodeIdentity({
          ip: result.ip,
          name: result.name,
          staticIp: result.staticIp,
          domain: result.domain
        })
      );
    }
  } catch (e) {
    console.error("Error getting vpn parameters");
  }
}

function* removeDappmanagerNotifications() {
  // Load notifications
  const notifications = yield select(selector.getNotifications);
  // Check the ones that came from the dappmanager
  const ids = notifications.filter(
    notification => notification.fromDappmanager
  );
  if (ids.length) {
    // Send the ids to the dappmanager
    yield call(APIcall.notificationsRemove, { ids });
    // Update the seen status so they are not sent again
    yield put(a.removeDappmanagerNotifications());
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  CONNECTION_OPEN: fetchVpnParams,
  FETCH_DAPPNODE_PARAMS: fetchVpnParams,
  [t.VIEWED_NOTIFICATIONS]: removeDappmanagerNotifications
};

export default rootWatcher(watchers);
