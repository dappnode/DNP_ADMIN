// WATCHERS
import autobahn from "autobahn";
import * as t from "./actionTypes";
import IPFS from "ipfs-mini";

const ipfs = new IPFS({
  host: "my.ipfs.dnp.dappnode.eth",
  port: 5001,
  protocol: "http"
});

const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";

export const updateStatus = (id, status) => ({
  type: t.UPDATE_STATUS,
  payload: status,
  id
});

export const removeChain = id => ({
  type: t.REMOVE_CHAIN,
  id
});

const NOWAMP = "can't connect to WAMP";
const NON_ADMIN_RESPONSE = "Your user is not an admin";

// No need to use "addTodo" name, in another module do:
// import todos from 'todos';
// todos.actions.add('Do that thing');

// const wait = () => new Promise(resolve => setTimeout(resolve, 1000));

const tags = {
  wamp: "wamp",
  dappmanager: "dappmanager",
  vpn: "vpn",
  isAdmin: "isAdmin",
  ipfs: "ipfs"
};

export const init = () => dispatch => {
  Object.keys(tags).forEach(tag => {
    dispatch(updateStatus({ id: tags[tag], status: 0, msg: "verifying..." }));
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

export const check = () => dispatch => {
  conntectToWamp(url, realm)
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
      dispatch(wampWorked(false, reason));
      dispatch(updateStatus({ id: tags.dappmanager, status: -1, msg: NOWAMP }));
      dispatch(updateStatus({ id: tags.vpn, status: -1, msg: NOWAMP }));
    });

  isIPFSworking()
    .then(
      res => false,
      err => (err ? (err.message ? err.message : err) : "Unknown error")
    )
    .then(err =>
      dispatch(
        updateStatus({
          id: tags.ipfs,
          status: err ? -1 : 1,
          msg: err ? JSON.stringify(err) : "ok"
        })
      )
    );
};

// UTILS

function conntectToWamp(url, realm) {
  const connection = new autobahn.Connection({ url, realm });

  return new Promise((resolve, reject) => {
    let timeout = setTimeout(function() {
      reject("timeout expired");
    }, 60 * 1000);
    connection.onclose = (reason, details) => {
      clearTimeout(timeout);
      reject(parseWampResponse(reason, details));
    };
    connection.onopen = session => {
      clearTimeout(timeout);
      resolve(session);
    };
    connection.onerror = reject;
    try {
      connection.open();
    } catch (e) {
      reject(e);
    }
  });
}

function parseWampResponse(reason, details) {
  if (
    details &&
    details.message &&
    details.message.includes("could not authenticate session")
  ) {
    return NON_ADMIN_RESPONSE;
  } else if (details && details.message) {
    return reason + ", " + details.message;
  } else {
    return reason;
  }
}

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
