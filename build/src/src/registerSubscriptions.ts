import autobahn from "autobahn";
import { getValidator } from "./utils/schemaValidation";
// Subscriptions
import * as autoUpdateData from "./route-types/subscriptionAutoUpdateData";
import * as chainData from "./route-types/subscriptionChainData";
import * as packages from "./route-types/subscriptionPackages";
import * as directory from "./route-types/subscriptionDirectory";
import * as progressLog from "./route-types/subscriptionProgressLog";
import * as pushNotification from "./route-types/subscriptionPushNotification";
import * as systemInfo from "./route-types/subscriptionSystemInfo";
import * as userActionLog from "./route-types/subscriptionUserActionLog";
import * as volumes from "./route-types/subscriptionVolumes";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
export function registerSubscriptions(
  session: autobahn.Session,
  errorHandler: (errorMessage: string) => void
) {
  function publish<T>(event: string, arg: T): void {
    // session.publish(topic, args, kwargs, options)
    session.publish(event, [], { data: arg });
  }

  function subscribe<T>(event: string, listener: (arg: T) => void): void {
    // session.subscribe(topic, function(args, kwargs, details) )
    session.subscribe(event, (_0, { data }) => {
      try {
        listener(data);
      } catch (e) {
        errorHandler(`Error on WAMP ${event}: ${e.stack}`);
      }
    });
  }

  /**
   * Bind each subscription typings to a WAMP session
   */
  function wampBusFactory<T>({
    route,
    returnDataSchema: dataSchema
  }: {
    route: string;
    returnDataSchema?: object;
    returnDataSample: T;
  }): {
    on: (listener: (arg: T) => void) => void;
    emit: (data: T) => void;
  } {
    const validateData = dataSchema
      ? getValidator<T>(dataSchema, "data")
      : null;

    return {
      on: (listener: (arg: T) => void): void => {
        subscribe<T>(route, data => {
          listener(validateData ? validateData(data) : data);
        });
      },
      emit: (data: T): void => {
        try {
          publish(route, validateData ? validateData(data) : data);
        } catch (e) {
          console.error(`Error on WAMP emit ${route}: ${e.stack}`);
        }
      }
    };
  }

  return {
    autoUpdateData: wampBusFactory(autoUpdateData),
    chainData: wampBusFactory(chainData),
    directory: wampBusFactory(directory),
    packages: wampBusFactory(packages),
    progressLog: wampBusFactory(progressLog),
    pushNotification: wampBusFactory(pushNotification),
    systemInfo: wampBusFactory(systemInfo),
    userActionLog: wampBusFactory(userActionLog),
    volumes: wampBusFactory(volumes)
  };
}
