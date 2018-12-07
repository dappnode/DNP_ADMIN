import autobahn from "autobahn-browser";
import store from "../store";
import socketSubscriptions from "./socketSubscriptions";
import initialCalls from "./initialCalls";

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
    socketSubscriptions(session);
    initialCalls(session)
    // For testing:
    window.call = (event, args = [], kwargs = {}) => session.call(event, args, kwargs)
  };

  // connection closed, lost or unable to connect
  connection.onclose = (reason, details) => {
    store.dispatch({ type: "CONNECTION_CLOSE", reason, details });
    console.error("CONNECTION_CLOSE", {reason, details})
  };

  connection.open();
}
