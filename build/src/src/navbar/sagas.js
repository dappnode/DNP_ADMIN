import { put, call } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher"
import * as APIcall from "API/rpcMethods";
import * as a from "./actions";

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

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  ["CONNECTION_OPEN"]: fetchVpnParams,
  ["FETCH_DAPPNODE_PARAMS"]: fetchVpnParams,
}

export default rootWatcher(watchers)
