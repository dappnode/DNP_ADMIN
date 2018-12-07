import autobahn from "autobahn-browser";
import store from "../store";
import socketSubscriptions from "./socketSubscriptions";
import initialCalls from "./initialCalls";
import pingPackage from './pingPackage'

// Initalize app
// Development
// const url = 'ws://localhost:8080/ws';
// const realm = 'realm1';
// Produccion
const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";

export function initApi() {
  const connection = new autobahn.Connection({
    url,
    realm
  });

  connection.onopen = session => {
    store.dispatch({ type: "CONNECTION_OPEN", session });
    console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
    // Crete socket subscriptions
    socketSubscriptions(session);

    // Execute initial calls
    initialCalls(session)

    // Run sanity checks
    async function pingPackages() {
      for (const packageName of ['dappmanager', 'vpn']) {
        const connected = await pingPackage(session, packageName)
        store.dispatch({ type: "UPDATE_PACKAGE_STATUS", packageName, connected });
      }
    }
    const pingInterval = setInterval(() => {
      if (session.isOpen) pingPackages()
      else clearInterval(pingInterval)
    }, 5000) 
    pingPackages()

    // For testing:
    window.call = (event, args = [], kwargs = {}) =>
      session.call(event, args, kwargs);
  };

  // connection closed, lost or unable to connect
  connection.onclose = (reason, details) => {
    store.dispatch({ type: "CONNECTION_CLOSE", reason, details });
    console.error("CONNECTION_CLOSE", { reason, details });
  };

  connection.open();
}
