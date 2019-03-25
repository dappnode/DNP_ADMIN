import autobahn from "autobahn-browser";
import store from "../store";
import subscriptions from "./subscriptions";

// Initalize app
// Development
// const url = 'ws://localhost:8080/ws';
// const realm = 'realm1';
// Produccion
const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";

let sessionCache;

export const getSession = () => sessionCache;

export default function start() {
  const connection = new autobahn.Connection({
    url,
    realm
  });

  connection.onopen = session => {
    sessionCache = session;
    store.dispatch({ type: "CONNECTION_OPEN", session });
    console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
    // Start subscriptions
    subscriptions(session);

    // For testing:
    window.call = (event, args = [], kwargs = {}) =>
      session.call(event, args, kwargs);
  };

  // connection closed, lost or unable to connect
  connection.onclose = (reason, details) => {
    store.dispatch({
      type: "CONNECTION_CLOSE",
      reason,
      details,
      session: connection
    });
    console.error("CONNECTION_CLOSE", { reason, details });
  };

  connection.open();
}
