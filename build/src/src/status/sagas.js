import { call, put, all, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import rootWatcher from "utils/rootWatcher";
import { updateStatus } from "./actions";
import * as APIcall from "API/rpcMethods";
import checkWampPackage from "./utils/checkWampPackage";
import checkIpfsConnection from "./utils/checkIpfsConnection";
import { push } from "connected-react-router";

const NOWAMP = "Can't connect to WAMP";

const tags = {
  wamp: "wamp",
  isAdmin: "isAdmin",
  dapp: "dappmanager",
  vpn: "vpn",
  upnp: "upnp",
  externalIP: "externalIP",
  ipfs: "ipfs"
};

/***************************** Subroutines ************************************/

let delayMs = 2000;
function* checkIPFS() {
  try {
    yield call(checkIpfsConnection);
    // Did work:
    yield put(updateStatus({ id: tags.ipfs, status: 1, msg: "ok" }));
  } catch (err) {
    // Did NOT work:
    yield put(updateStatus({ id: tags.ipfs, status: -1, msg: err }));
    // Keep retrying until the connection is ok
    delayMs = delayMs * 2;
    yield delay(delayMs);
    yield call(checkIPFS);
  }
}

function* getStatusUpnp() {
  try {
    const res = yield call(APIcall.getStatusUpnp);
    if (res.success) {
      const result = res.result;
      let status = result.openPorts && !result.upnpAvailable ? 0 : 1;
      let msg;
      if (result.openPorts && !result.upnpAvailable) {
        msg =
          "UPnP device not found, please try to activate it in your router or manually open the required ports when installing packages";
      } else if (!result.openPorts) {
        msg = "UPnP not necessary";
      } else {
        msg = "ok";
      }
      yield put(updateStatus({ id: tags.upnp, status, msg }));
    } else {
      console.error("Error fetching UPnP status" + res.message);
    }
  } catch (e) {
    // It will throw when connection is not open, ignore
  }
}

function* getStatusExternalIp() {
  try {
    const res = yield call(APIcall.getStatusExternalIp);
    if (res.success) {
      // Determine if user will have to open ports
      const result = res.result || {};
      let status = 0;
      let msg = "Error verifying external ip status";
      if (result) {
        if (result.externalIpResolves) {
          msg = "Resolves";
          status = 1;
        } else {
          msg =
            "External IP does not resolve (" +
            (result.attempts || 10) +
            " attempts). " +
            "Please use the internal IP: " +
            (result.internalIp || "(missing-ip)") +
            " when you are in the same network as your DAppNode" +
            " and the external IP: " +
            (result.externalIp || "(missing-ip)") +
            " otherwise";
        }
      }
      yield put(updateStatus({ id: tags.externalIP, status, msg }));
    } else {
      console.error("Error fetching external IP status: " + res.message);
    }
  } catch (e) {
    // It will throw when connection is not open, ignore
  }
}

function* initializeLoadingMessages() {
  yield all(
    Object.keys(tags).map(tag =>
      put(updateStatus({ id: tags[tag], status: 0, msg: "verifying..." }))
    )
  );
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// The channels below can be stopped by changing the code a little bit
// You would fire a STOP action to stop the channel loop and a START to restart.
// Example: https://github.com/jaysoo/example-redux-saga/blob/master/src/timer/saga.js

function* onConnectionOpen({ session }) {
  yield put(updateStatus({ id: tags.wamp, status: 1, msg: "ok" }));
  yield put(updateStatus({ id: tags.isAdmin, status: 1, msg: "yes" }));
  // Check if the dappmanager is connected to the WAMP
  yield fork(checkPackage, session, tags.dapp);
  // Check if the vpn is connected and then get its info
  const vpnRes = yield call(checkPackage, session, tags.vpn);
  if (vpnRes.status === 1) {
    yield all([call(getStatusUpnp), call(getStatusExternalIp)]);
  }
}

function* checkPackage(session, id) {
  const res = yield call(checkWampPackage, session, id);
  yield put(updateStatus({ id, ...res }));
  return res;
}

function* onConnectionClose({ reason, details = {} }) {
  yield put(updateStatus({ id: tags.wamp, status: -1, msg: NOWAMP }));
  const nonAdmin = (details.message || "").includes(
    "could not authenticate session"
  );
  yield put(
    updateStatus({
      id: tags.isAdmin,
      status: nonAdmin ? -1 : 0,
      msg: nonAdmin ? "no" : "unknown"
    })
  );
  if (nonAdmin) {
    yield put(push("/nonadmin"));
  }
  yield put(updateStatus({ id: tags.dapp, status: 0, msg: NOWAMP }));
  yield put(updateStatus({ id: tags.vpn, status: 0, msg: NOWAMP }));
}

function* runIpfsMonitor() {
  yield fork(checkIPFS);
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  CONNECTION_OPEN: onConnectionOpen,
  CONNECTION_CLOSE: onConnectionClose
};

export default rootWatcher(watchers);
