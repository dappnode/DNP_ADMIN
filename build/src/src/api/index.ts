import { useEffect } from "react";
import autobahn from "autobahn";
import useSWR, { responseInterface } from "swr";
import { mapValues } from "lodash";
import { wampUrl, wampRealm } from "params";
import store from "../store";
import { stringIncludes } from "utils/strings";
// Transport
import { subscriptionsFactory, callRoute } from "common/transport/autobahn";
import {
  Subscriptions,
  subscriptionsData,
  SubscriptionsTypes
} from "common/subscriptions";
import { Routes, routesData, ResolvedType } from "common/routes";
import { Args } from "common/transport/types";
// Internal
import { mapSubscriptionsToRedux } from "./subscriptions";
import {
  connectionOpen,
  connectionClose
} from "services/connectionStatus/actions";
import { initialCallsOnOpen } from "./initialCalls";
import { PubSub } from "./utils";

const url = wampUrl;
const realm = wampRealm;

let _session: autobahn.Session;

/**
 * Bridges events from the autobahn client to any consumer in the App
 * All WAMP events will be emitted in this PubSub instance
 * If a part of the App wants to subscribe to an event just do
 * ```
 * wampEventBridge.on(route, callback)
 * ```
 * Or use the hook `useSubscription`
 */
const wampEventBridge = new PubSub();

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
    const argsKey = args.length > 0 ? JSON.stringify(args) : "";
    const cacheKey = route + argsKey;
    return useSWR([cacheKey, route], () => (handler as any)(...args));
  };
});

/**
 * Bridges events from the autobahn client to any consumer in the App
 * **Note**: this callback MUST be memoized
 * or the hook will unsubscribe and re-subscribe the new callback on each
 * re-render.
 * ```
 * // Non changing callback
 * const [devices, setDevices] = useState<VpnDevice[]>();
 * useSubscription.devices(setDevices);
 *
 * // Changing callback, requires memoization
 * useSubscription.devices(
 *  useMemo(
 *    data => setDevices(data),
 *    [dependency]
 *  )
 *);
 * ```
 */
export const useSubscription: {
  [K in keyof Subscriptions]: (
    callback: (...args: Parameters<SubscriptionsTypes[K]>) => void
  ) => void;
} = mapValues(subscriptionsData, (data, route) => {
  return function(callback: (...args: any) => void) {
    useEffect(() => {
      wampEventBridge.on(route, callback);
      return () => {
        wampEventBridge.off(route, callback);
      };
    }, [callback]);
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
    // Start subscriptions

    const subscriptions = subscriptionsFactory<Subscriptions>(
      session,
      subscriptionsData,
      { loggerMiddleware: subscriptionsLoggerMiddleware }
    );
    mapValues(subscriptions, (handler, route) => {
      handler.on((...args) => wampEventBridge.emit(route, ...args));
    });

    mapSubscriptionsToRedux(subscriptions);
    initialCallsOnOpen();

    // For testing:
    // @ts-ignore
    window.call = (event, args, kwargs = {}) =>
      session.call(event, args, kwargs);

    // Delay announcing session is open until everything is setup
    store.dispatch(connectionOpen());
    console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
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
