import {
  actionChannel,
  take,
  call,
  put,
  all,
  takeEvery,
  fork
} from "redux-saga/effects";
import { delay } from "redux-saga";
import * as t from "./actionTypes";
import { updateStatus } from "./actions";
import * as APIcall from "API/rpcMethods";
import { NON_ADMIN_RESPONSE } from "./constants";
import checkWampPackage from "./utils/checkWampPackage";
import checkIpfsConnection from "./utils/checkIpfsConnection";
import chains from "chains";
import { push } from "connected-react-router";

const NOWAMP = "Can't connect to WAMP";

const tags = {
  wamp: "wamp",
  isAdmin: "isAdmin",
  dapp: "dappmngr",
  vpn: "vpn",
  upnp: "upnp",
  externalIP: "extIP",
  ipfs: "ipfs",
  mainnet: "mainnet"
};

/***************************** Subroutines ************************************/

function* checkIPFS() {
  try {
    yield call(checkIpfsConnection);
    // Did work:
    yield put(updateStatus({ id: tags.ipfs, status: 1, msg: "ok" }));
  } catch (err) {
    // Did NOT work:
    yield put(updateStatus({ id: tags.ipfs, status: -1, msg: err }));
  }
}

function* getStatusUPnP() {
  try {
    const res = yield call(APIcall.getStatusUPnP);
    if (res.success) {
      const { status, msg } = statusUPnPLogic(res.result);
      yield put(updateStatus({ id: tags.upnp, status, msg }));
    } else {
      console.error("Error fetching UPnP status" + res.message);
    }
  } catch (e) {
    // It will throw when connection is not open, ignore
  }
}

function statusUPnPLogic(res) {
  let status = res.openPorts && !res.UPnP ? 0 : 1;
  let msg;
  if (res.openPorts && !res.UPnP) {
    msg =
      "UPnP device not found, please try to activate it in your router or manually open the required ports when installing packages";
  } else if (!res.openPorts) {
    msg = "UPnP not necessary";
  } else {
    msg = "ok";
  }
  return { status, msg };
}

function* getStatusExternalIp() {
  try {
    const res = yield call(APIcall.getStatusExternalIp);
    if (res.success) {
      const { status, msg } = statusExternalIpLogic(res.result);
      yield put(updateStatus({ id: tags.externalIP, status, msg }));
    } else {
      console.error("Error fetching external IP status: " + res.message);
    }
  } catch (e) {
    // It will throw when connection is not open, ignore
  }
}

function statusExternalIpLogic(res) {
  // Determine if user will have to open ports
  let status = 0;
  let msg = "Error verifying external ip status";
  if (res) {
    if (res.externalIpResolves) {
      msg = "Resolves";
      status = 1;
    } else {
      msg =
        "External IP does not resolve (" +
        (res.attempts || 10) +
        " attempts). " +
        "Please use the internal IP: " +
        (res.INT_IP || "ERROR") +
        " when you are in the same network as your DAppNode" +
        " and the external IP: " +
        (res.EXT_IP || "ERROR") +
        " otherwise";
    }
  }
  return { status, msg };
}

function* initializeLoadingMessages() {
  yield all(
    Object.keys(tags).map(tag =>
      put(updateStatus({ id: tags[tag], status: 0, msg: "verifying..." }))
    )
  );
}

function* mainnetUpdate(action) {
  if (action.id !== "Mainnet") return;
  const { msg, status } = action.payload;
  yield put(updateStatus({ id: tags.mainnet, status, msg }));
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// The channels below can be stopped by changing the code a little bit
// You would fire a STOP action to stop the channel loop and a START to restart.
// Example: https://github.com/jaysoo/example-redux-saga/blob/master/src/timer/saga.js

function* watchMainnetUpdate() {
  yield takeEvery(chains.actionTypes.UPDATE_STATUS, mainnetUpdate);
}

function* onConnectionOpen({ session }) {
  yield put(updateStatus({ id: tags.wamp, status: 1, msg: "ok" }));
  yield put(updateStatus({ id: tags.isAdmin, status: 1, msg: "yes" }));
  // Check if the dappmanager is connected to the WAMP
  yield fork(checkPackage, session, tags.dapp);
  // Check if the vpn is connected and then get its info
  const vpnRes = yield call(checkPackage, session, tags.vpn);
  if (vpnRes.status === 1) {
    yield all([call(getStatusUPnP), call(getStatusExternalIp)]);
  }
}

function* checkPackage(session, id) {
  const res = yield call(checkWampPackage, session, id);
  yield put(updateStatus({ id, ...res }));
  return res;
}

function* onConnectionClose({ reason, details = {} }) {
  yield put(updateStatus({ id: tags.wamp, status: -1, msg: NOWAMP }));
  const nonAdmin = (details.message || "").includes(NON_ADMIN_RESPONSE);
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
  // Dispatching an action of type start will activate the channel
  const channel = yield actionChannel(t.IPFS_START);

  while (yield take(channel)) {
    while (true) {
      // This is check at every tick of the interval
      yield call(checkIPFS);
      // The actual interval of the loop
      yield delay(5 * 1000);
    }
  }
}

function* watchConnectionOpen() {
  yield takeEvery("CONNECTION_OPEN", onConnectionOpen);
}

function* watchConnectionClose() {
  yield takeEvery("CONNECTION_CLOSE", onConnectionClose);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([
    call(initializeLoadingMessages),
    runIpfsMonitor(),
    watchConnectionOpen(),
    watchConnectionClose(),
    watchMainnetUpdate()
  ]);
}
