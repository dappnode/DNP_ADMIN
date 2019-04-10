import autobahn from "autobahn-browser";
import store from "../store";
import subscriptions from "./subscriptions";
import {
  connectionOpen,
  connectionClose
} from "services/connectionStatus/actions";

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
  const connection = new autobahn.Connection({ url, realm });

  connection.onopen = session => {
    sessionCache = session;
    store.dispatch(connectionOpen({ session }));
    console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
    // Start subscriptions
    subscriptions(session);
    // For testing:
    window.call = (event, kwargs = {}) => session.call(event, [], kwargs);
  };

  // connection closed, lost or unable to connect
  connection.onclose = (reason, details) => {
    store.dispatch(
      connectionClose({
        error: [reason, (details || {}).message].filter(x => x).join(" - "),
        session: connection,
        isNotAdmin: (details.message || "").includes(
          "could not authenticate session"
        )
      })
    );
    console.error("CONNECTION_CLOSE", { reason, details });
  };

  connection.open();
}
