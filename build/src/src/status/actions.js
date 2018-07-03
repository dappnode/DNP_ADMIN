// WATCHERS
import * as t from "./actionTypes";
import * as APIcall from "API/crossbarCalls";
import IPFS from "ipfs-mini";
import checkConnection from "API/checkConnection";
import chains from "chains";
import { NON_ADMIN_RESPONSE } from "./constants";

const ipfs = new IPFS({
  host: "my.ipfs.dnp.dappnode.eth",
  port: 5001,
  protocol: "http"
});

const updateStatus = status => ({
  type: t.UPDATE_STATUS,
  payload: status
});

const NOWAMP = "Can't connect to WAMP";

// No need to use "addTodo" name, in another module do:
// import todos from 'todos';
// todos.actions.add('Do that thing');

// const wait = () => new Promise(resolve => setTimeout(resolve, 1000));

const tags = {
  wamp: "wamp",
  dappmanager: "dappmanager",
  vpn: "vpn",
  isAdmin: "isAdmin",
  ipfs: "ipfs",
  mainnet: "mainnet",
  upnp: "upnp",
  externalIP: "externalIP"
};

export const init = () => dispatch => {
  // Initialize status
  Object.keys(tags).forEach(tag => {
    dispatch(updateStatus({ id: tags[tag], status: 0, msg: "verifying..." }));
  });
};

export const checkOnce = () => dispatch => {
  // Call status checks that are only checked once
  getStatusUPnP()(dispatch);
  getStatusExternalIp()(dispatch);
};

export const getStatusUPnP = () => dispatch => {
  // Load necessary info

  APIcall.getStatusUPnP().then(res => {
    // Determine if user will have to open ports
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

    dispatch(
      updateStatus({
        id: tags.upnp,
        status,
        msg
      })
    );
  });
};

export const getStatusExternalIp = () => dispatch => {
  // Load necessary info

  APIcall.getStatusExternalIp().then(res => {
    // Determine if user will have to open ports
    let status = 0;
    let msg;
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
          " and the external IP " +
          (res.EXT_IP || "ERROR") +
          " otherwise";
      }
    } else {
      msg = "Error verifying external ip status";
    }

    dispatch(
      updateStatus({
        id: tags.externalIP,
        status,
        msg
      })
    );
  });
};

const wampWorked = (worked, reason) => dispatch => {
  dispatch(
    updateStatus({
      id: tags.wamp,
      status: worked ? 1 : -1,
      msg: worked ? "ok" : reason
    })
  );
  dispatch(
    updateStatus({
      id: tags.isAdmin,
      status: worked ? 1 : reason.includes(NON_ADMIN_RESPONSE) ? -1 : 0,
      msg: worked
        ? "yes"
        : reason.includes(NON_ADMIN_RESPONSE)
          ? "no"
          : "unknown"
    })
  );
};

export const check = () => (dispatch, getState) => {
  // Check Mainnet, import status from the chains module
  const MainnetStatus = chains.selectors.getMainnet(getState());
  if (MainnetStatus)
    dispatch(
      updateStatus({
        id: tags.mainnet,
        status: MainnetStatus.status,
        msg: MainnetStatus.msg
      })
    );

  // Check WAMP
  checkConnection()
    .then(session => {
      dispatch(wampWorked(true, ""));
      crossbarPackageCheck(tags.dappmanager, session).then(res =>
        dispatch(updateStatus({ id: tags.dappmanager, ...res }))
      );
      crossbarPackageCheck(tags.vpn, session).then(res =>
        dispatch(updateStatus({ id: tags.vpn, ...res }))
      );
    })
    .catch(reason => {
      if (reason.includes("Warning")) {
        dispatch(updateStatus({ id: tags.wamp, status: 0, msg: reason }));
      } else {
        dispatch(wampWorked(false, reason));
        dispatch(
          updateStatus({ id: tags.dappmanager, status: -1, msg: NOWAMP })
        );
        dispatch(updateStatus({ id: tags.vpn, status: -1, msg: NOWAMP }));
      }
    });

  // Check IPFS
  isIPFSworking()
    .then(
      res => false,
      err => (err ? (err.message ? err.message : err) : "Unknown error")
    )
    .then(err => {
      let msg = err ? JSON.stringify(err) : "ok";
      if (msg.includes("[ipfs-mini] status 0:"))
        msg = "Can't connect to IPFS module";
      dispatch(
        updateStatus({
          id: tags.ipfs,
          status: err ? -1 : 1,
          msg
        })
      );
    });
};

// UTILS

async function crossbarPackageCheck(packageName, session) {
  const call = "ping." + packageName + ".dnp.dappnode.eth";
  return session.call(call, ["ping"]).then(
    res => ({ status: 1, msg: "ok" }),
    err => ({
      status: -1,
      msg:
        err.error && err.error.includes("no_such_procedure")
          ? "Core package not running or not connected"
          : err.error || err.message || JSON.stringify(err)
    })
  );
}

function isIPFSworking() {
  // Attempts to cat the readme file and expect it to contain 'Hello and Welcome to IPFS!'
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject("Timeout expired, ipfs may be down");
    }, 3000);

    ipfs.cat("QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB", function(
      err,
      file
    ) {
      clearTimeout(timer);
      if (err) return reject(err);
      if (file.includes("Hello and Welcome to IPFS!")) return resolve();
      else return reject("Error parsing file");
    });
  });
}
