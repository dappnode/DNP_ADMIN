import autobahn from "autobahn";
import useSWR, { responseInterface } from "swr";
import { mapValues } from "lodash";
import { wampUrl, wampRealm } from "params";
import store from "../store";
import { stringIncludes } from "utils/strings";
// Transport
import { subscriptionsFactory, callRoute } from "common/transport/autobahn";
import { Subscriptions, subscriptionsData } from "common/subscriptions";
import { Routes, routesData, ResolvedType } from "common/routes";
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
let _subscriptions: Subscriptions;

export const api: Routes = mapValues(routesData, (data, route) => {
  return async function(...args: any[]) {
    // If session is not available, fail gently
    if (!_session) throw Error("Session object is not defined");
    if (!_session.isOpen) throw Error("Connection is not open");

    return await callRoute<any>(_session, route, args);
  };
});

export const useApi: {
  [K in keyof Routes]: (
    ...args: Parameters<Routes[K]>
  ) => responseInterface<ResolvedType<Routes[K]>, Error>;
} = mapValues(api, (handler, route) => {
  return function(...args: any[]) {
    const cacheKey = route + JSON.stringify(args);
    return useSWR([cacheKey, route], () => (handler as any)(...args));
  };
});

export function getApiSubscription(): Subscriptions {
  if (!_subscriptions) throw Error("Subscriptions object is not defined");
  return _subscriptions;
}

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
    _subscriptions = subscriptions;

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
