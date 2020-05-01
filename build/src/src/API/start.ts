import autobahn from "autobahn";
import { mapValues } from "lodash";
import store from "../store";
import { stringIncludes } from "utils/strings";
// Transport
import { subscriptionsFactory, callRoute } from "common/transport/autobahn";
import { Subscriptions, subscriptionsData } from "common/subscriptions";
import { Routes, routesData } from "common/routes";
import { Args } from "common/transport/types";
// Internal
import {
  legacyVpnSubscription,
  mapSubscriptionsToRedux
} from "./subscriptions";
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

let sessionCache: autobahn.Session;

export const getSession = (): autobahn.Session | undefined => sessionCache;

export const api: Routes = mapValues(routesData, (data, route) => {
  return async function(...args: any[]) {
    const session = getSession();
    // If session is not available, fail gently
    if (!session) throw Error("Session object is not defined");
    if (!session.isOpen) throw Error("Connection is not open");

    return await callRoute<any>(session, route, args);
  };
});

export function start() {
  const connection = new autobahn.Connection({ url, realm });

  connection.onopen = session => {
    sessionCache = session;
    store.dispatch(connectionOpen({ session }));
    console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
    // Start subscriptions

    const subscriptions = subscriptionsFactory<Subscriptions>(
      session,
      subscriptionsData,
      { loggerMiddleware: subscriptionsLoggerMiddleware }
    );

    mapSubscriptionsToRedux(subscriptions);
    legacyVpnSubscription(session);

    // For testing:
    // @ts-ignore
    window.call = (event, args, kwargs = {}) =>
      session.call(event, args, kwargs);
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

const subscriptionsLoggerMiddleware = {
  onError: (route: string, error: Error, args?: Args): void => {
    console.error(`Subscription error ${route}: ${error.stack}`, args);
  }
};
