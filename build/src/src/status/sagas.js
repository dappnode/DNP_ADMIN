import {
  actionChannel,
  take,
  call,
  put,
  all,
  select,
  takeEvery,
  fork
} from "redux-saga/effects";
import { delay } from "redux-saga";
import * as t from "./actionTypes";
import * as s from "./selectors";
import { updateStatus } from "./actions";
import * as APIcall from "API/crossbarCalls";
import checkConnection from "API/checkConnection";
import { NON_ADMIN_RESPONSE } from "./constants";
import checkWampPackage from "./utils/checkWampPackage";
import checkIpfsConnection from "./utils/checkIpfsConnection";
import chains from "chains";

const NOWAMP = "Can't connect to WAMP";

const tags = {
  wamp: "wamp",
  dapp: "dappmanager",
  vpn: "vpn",
  isAdmin: "isAdmin",
  ipfs: "ipfs",
  mainnet: "mainnet",
  upnp: "upnp",
  externalIP: "externalIP"
};

/***************************** Subroutines ************************************/

function* checkWamp() {
  try {
    yield call(checkConnection);
    // Did work: Update status of all WAMP dependent modules
    yield put(updateStatus({ id: tags.wamp, status: 1, msg: "ok" }));
  } catch (reason) {
    if (reason.includes("Warning")) {
      // Not clear if it's not working
      yield put(updateStatus({ id: tags.wamp, status: 0, msg: reason }));
    } else {
      // Did NOT work: Update status of all WAMP dependent modules
      yield put(updateStatus({ id: tags.wamp, status: -1, msg: reason }));
    }
  }
}

function* checkWampPackages() {
  try {
    const session = yield call(checkConnection);
    // Now, check if each pacakge is connected to WAMP
    yield call(checkPackage, session, tags.dapp);
    yield call(checkPackage, session, tags.vpn);
  } catch (e) {
    // If connection error, cannot check packages
    yield put(updateStatus({ id: tags.dapp, status: -1, msg: NOWAMP }));
    yield put(updateStatus({ id: tags.vpn, status: -1, msg: NOWAMP }));
  }
}

function* checkIsAdmin() {
  try {
    const wamp = yield select(s.getWamp);
    if (!wamp || !wamp.msg) return;

    if (wamp.status === 1) {
      // If connection is successful, user is admin
      yield put(updateStatus({ id: tags.isAdmin, status: 1, msg: "yes" }));
    } else if (wamp.status === -1) {
      // Check if error is due to user not being admin
      const userIsAdmin = !wamp.msg.includes(NON_ADMIN_RESPONSE);
      yield put(
        updateStatus({
          id: tags.isAdmin,
          status: userIsAdmin ? 0 : -1,
          msg: userIsAdmin ? "unknown" : "no"
        })
      );
    }
  } catch (e) {
    // #### TODO
  }
}

function* checkPackage(session, id) {
  const res = yield call(checkWampPackage, session, id);
  yield put(updateStatus({ id, ...res }));
}

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
    yield call(checkConnection);
    const res = yield call(APIcall.getStatusUPnP);
    const { status, msg } = statusUPnPLogic(res);
    yield put(updateStatus({ id: tags.upnp, status, msg }));
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
    yield call(checkConnection);
    const res = yield call(APIcall.getStatusExternalIp);
    const { status, msg } = statusExternalIpLogic(res);
    yield put(updateStatus({ id: tags.externalIP, status, msg }));
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

function* runWampMonitor() {
  // Dispatching an action of type start will activate the channel
  const channel = yield actionChannel(t.WAMP_START);

  while (yield take(channel)) {
    // This is check once every channel start
    // fork creates a non-block instance. Rest of the code starts immediately
    yield fork(function*() {
      yield all([call(getStatusUPnP), call(getStatusExternalIp)]);
    });

    while (true) {
      // This is check at every tick of the interval
      yield call(checkWamp);
      yield call(checkIsAdmin);
      yield call(checkWampPackages);
      // The actual interval of the loop
      yield delay(5 * 1000);
    }
  }
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

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([
    call(initializeLoadingMessages),
    runIpfsMonitor(),
    runWampMonitor(),
    watchMainnetUpdate()
  ]);
}
