import { call, put, all, fork } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import { updateStatus } from "./actions";
import APIcall from "API/rpcMethods";
import checkWampPackage from "./utils/checkWampPackage";
import { push } from "connected-react-router";

const NOWAMP = "Can't connect to WAMP";

const tags = {
  wamp: "wamp",
  isAdmin: "isAdmin",
  dapp: "dappmanager",
  vpn: "vpn",
  upnp: "upnp",
  ipfs: "ipfs"
};

/***************************** Subroutines ************************************/

function* getVpnStatus() {
  try {
    const res = yield call(APIcall.getParams);
    // noNatLoopback: true / false,
    // alertToOpenPorts: true / false,
    // internalIp: 192.168.0.1,
    const { noNatLoopback, alertToOpenPorts, internalIp } =
      (res || {}).result || {};
    if (alertToOpenPorts)
      yield put(
        updateStatus({
          id: "alertToOpenPorts",
          status: 0,
          msg:
            "Please manually open the required ports https://dappnode.github.io/DAppNodeDocs/troubleshooting/#ports-that-need-to-be-opened"
        })
      );
    if (noNatLoopback)
      yield put(
        updateStatus({
          id: "noNatLoopback",
          status: 0,
          msg: `Please check your router's NAT loopback, otherwise use the interal IP ${internalIp} when you are in the same network as your DAppNode`
        })
      );
  } catch (e) {
    console.error("Error fetching VPN params (u");
  }
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
    yield all([call(getVpnStatus)]);
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

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  ["CONNECTION_OPEN", onConnectionOpen],
  ["CONNECTION_CLOSE", onConnectionClose]
];

export default rootWatcher(watchers);
