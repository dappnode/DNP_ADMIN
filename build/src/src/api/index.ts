import autobahn from "autobahn";
import { mapValues } from "lodash";
import { wampUrl, wampRealm } from "params";
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
import { initialCallsOnOpen } from "./initialCalls";

const url = wampUrl;
const realm = wampRealm;

let _session: autobahn.Session;

export const api: Routes = mapValues(routesData, (data, route) => {
  return async function(...args: any[]) {
    // If session is not available, fail gently
    if (!_session) throw Error("Session object is not defined");
    if (!_session.isOpen) throw Error("Connection is not open");

    return await callRoute<any>(_session, route, args);
  };
});

/**
 * Connect to the WAMP with an autobahn client
 * Store the session and map subscriptions
 */
export function start() {
  const connection = new autobahn.Connection({ url, realm });

  connection.onopen = session => {
    _session = session;
    store.dispatch(connectionOpen());
    console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
    // Start subscriptions

    const subscriptions = subscriptionsFactory<Subscriptions>(
      session,
      subscriptionsData,
      { loggerMiddleware: subscriptionsLoggerMiddleware }
    );

    mapSubscriptionsToRedux(subscriptions);
    legacyVpnSubscription(session);
    initialCallsOnOpen();

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
