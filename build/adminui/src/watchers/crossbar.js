import autobahn from "autobahn";
import * as AppActions from "actions/AppActions";

const NON_ADMIN_RESPONSE = "Your user is not an admin";
const INTERVAL_S = 5; // s

// initialize
AppActions.updateStatus({
  pkg: "wamp",
  item: "connection",
  on: 0,
  msg: "verifying..."
});
AppActions.updateStatus({
  pkg: "dappmanager",
  item: "crossbar",
  on: 0,
  msg: "verifying..."
});
AppActions.updateStatus({
  pkg: "vpn",
  item: "crossbar",
  on: 0,
  msg: "verifying..."
});

// Initial call
check();

// Keep checking every
setTimeout(() => {
  check();
}, INTERVAL_S * 1000);

async function check() {
  // VPN

  // WAMP
  let session = await wampCheck();

  if (session) {
    await crossbarPackageCheck("dappmanager", session);
    await crossbarPackageCheck("vpn", session);
  }
  // PING THROUGH
}

async function crossbarPackageCheck(packageName, session) {
  const call = "ping." + packageName + ".dnp.dappnode.eth";

  try {
    await session.call(call, ["ping"]);
    AppActions.updateStatus({
      pkg: packageName,
      item: "crossbar",
      on: 1,
      msg: "ok"
    });
  } catch (e) {
    let errorMsg;
    if (e.error && e.error.includes("no_such_procedure"))
      errorMsg = "Core package not running or not connected";
    else errorMsg = e.error || e.message || JSON.stringify(e);

    AppActions.updateStatus({
      pkg: packageName,
      item: "crossbar",
      on: -1,
      msg: errorMsg
    });
  }
}

async function wampCheck() {
  const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
  const realm = "dappnode_admin";

  try {
    let session = await conntectToWamp(url, realm);
    AppActions.updateStatus({
      pkg: "wamp",
      item: "connection",
      on: 1,
      msg: "ok"
    });
    return session;
  } catch (reason) {
    AppActions.updateStatus({
      pkg: "wamp",
      item: "connection",
      on: -1,
      msg: reason,
      nonAdmin: reason.includes(NON_ADMIN_RESPONSE)
    });
    AppActions.updateStatus({
      pkg: "dappmanager",
      item: "crossbar",
      on: -1,
      msg: "can't connect to WAMP"
    });
    AppActions.updateStatus({
      pkg: "vpn",
      item: "crossbar",
      on: -1,
      msg: "can't connect to WAMP"
    });
  }
}

function conntectToWamp(url, realm) {
  const connection = new autobahn.Connection({ url, realm });

  return new Promise((resolve, reject) => {
    let timeout = setTimeout(function() {
      reject("timeout expired");
    }, 60 * 1000);
    connection.onclose = (reason, details) => {
      clearTimeout(timeout);
      if (
        details &&
        details.message &&
        details.message.includes("could not authenticate session")
      ) {
        reject(NON_ADMIN_RESPONSE);
      } else if (details && details.message) {
        reject(reason + ", " + details.message);
      } else {
        reject(reason);
      }
    };
    connection.onopen = session => {
      clearTimeout(timeout);
      resolve(session);
    };
    connection.open();
  });
}
