import autobahn from "autobahn";
import store from "../store";
import subscriptions from "./subscriptions";
import {
  connectionOpen,
  connectionClose
} from "services/connectionStatus/actions";
import { stringIncludes } from "utils/strings";

// Initalize app
// Development
// const url = 'ws://localhost:8080/ws';
// const realm = 'realm1';
// Produccion
const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";

let sessionCache: autobahn.Session;

export const getSession = (): autobahn.Session | undefined => sessionCache;

export default function start() {
  const connection = new autobahn.Connection({ url, realm });

  connection.onopen = session => {
    sessionCache = session;
    store.dispatch(connectionOpen({ session }));
    console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
    // Start subscriptions
    subscriptions(session);
    // For testing:
    // @ts-ignore
    window.call = (event, kwargs = {}) => session.call(event, [], kwargs);
  };

  // connection closed, lost or unable to connect
  connection.onclose = (reason, details) => {
    store.dispatch(
      connectionClose({
        error: [reason, (details || {}).message].filter(x => x).join(" - "),
        session: connection,
        isNotAdmin: stringIncludes(
          details.message,
          "could not authenticate session"
        )
      })
    );
    console.error("CONNECTION_CLOSE", { reason, details });
    return false;
  };

  connection.open();
}
