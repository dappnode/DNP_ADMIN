import store from "../store";
import autobahn from "autobahn";
import { registerSubscriptions } from "../registerSubscriptions";
// Actions to push received content
import { pushNotificationFromDappmanager } from "services/notifications/actions";
import { updateChainData } from "services/chainData/actions";
import { updateDevices } from "services/devices/actions";
import { pushUserActionLog } from "services/userActionLogs/actions";
import {
  clearIsInstallingLog,
  updateIsInstallingLog
} from "services/isInstallingLogs/actions";
import { updateAutoUpdateData } from "services/dappnodeStatus/actions";
import { DirectoryItem, PackageContainer } from "types";
import { returnDataSchema as directorySchema } from "../route-types/fetchDirectory";
import { returnDataSchema as dnpInstalledSchema } from "../route-types/listPackages";
import { getValidator } from "utils/schemaValidation";
import { setDnpInstalled } from "services/dnpInstalled/actions";

const validateDirectory = getValidator<DirectoryItem[]>(directorySchema);
const validateDnpInstalled = getValidator<PackageContainer[]>(
  dnpInstalledSchema
);

export default function subscriptions(session: autobahn.Session) {
  const wampSubscriptions = registerSubscriptions(session, errorMessage => {
    console.error(errorMessage);
  });
  /**
   * Utilities to encode arguments to publish with the Crossbar format (args, kwargs)
   * - Publisher:
   *     publish("event.name", arg1, arg2)
   * - Subscriber:
   *     session.subscribe("event.name", args => {
   *       listener(...args)
   *     })
   */
  // function publish(event, ...args) {
  //   // session.publish(topic, args, kwargs, options)
  //   session.publish(event, args);
  // }
  function subscribe<T>(event: string, cb: (arg: T) => void) {
    // session.subscribe(topic, function(args, kwargs, details) )
    session.subscribe(event, (arg: T) => {
      try {
        cb(arg);
      } catch (e) {
        console.error(`Error on WAMP ${event}: ${e.stack}`);
      }
    });
  }

  /**
   * @param {object} autoUpdateData = {
   *   settings: {
   *     "system-packages": { enabled: true }
   *     "my-packages": { enabled: true }
   *     "bitcoin.dnp.dappnode.eth": { enabled: false }
   *   },
   *   registry: { "core.dnp.dappnode.eth": {
   *     "0.2.4": { updated: 1563304834738, successful: true },
   *     "0.2.5": { updated: 1563304834738, successful: false }
   *   }, ... },
   *   pending: { "core.dnp.dappnode.eth": {
   *     version: "0.2.4",
   *     firstSeen: 1563218436285,
   *     scheduledUpdate: 1563304834738,
   *     completedDelay: true
   *   }, ... },
   *   dnpsToShow: [{
   *     id: "system-packages",
   *     displayName: "System packages",
   *     enabled: true,
   *     feedback: {
   *       updated: 15363818244,
   *       manuallyUpdated: true,
   *       inQueue: true,
   *       scheduled: 15363818244
   *     }
   *   }, ... ]
   * }
   */
  wampSubscriptions.autoUpdateData.on(autoUpdateData => {
    store.dispatch(updateAutoUpdateData(autoUpdateData));
  });

  /**
   * @param {object} userActionLog = {
   *   level: "info" | "error", {string}
   *   event: "installPackage.dnp.dappnode.eth", {string}
   *   message: "Successfully install DNP", {string} Returned message from the call function
   *   result: { data: "contents" }, {*} Returned result from the call function
   *   kwargs: { id: "dnpName" }, {object} RPC key-word arguments
   *   // Only if error
   *   message: e.message, {string}
   *   stack: e.stack {string}
   * }
   */
  wampSubscriptions.userActionLog.on(userActionLog => {
    store.dispatch(pushUserActionLog(userActionLog));
  });

  /**
   * DNP installation progress log
   * @param {object} logData = {
   *   id: "ln.dnp.dappnode.eth@/ipfs/Qmabcdf", {string} overall log id (to bundle multiple logs)
   *   name: "bitcoin.dnp.dappnode.eth", {string} dnpName the log is referring to
   *   message: "Downloading 75%", {string} log message
   * }
   */
  wampSubscriptions.progressLog.on(progressLog => {
    const { id, name: dnpName, message: log, clear } = progressLog;
    if (clear) store.dispatch(clearIsInstallingLog({ id }));
    else store.dispatch(updateIsInstallingLog({ id, dnpName, log }));
  });

  wampSubscriptions.packages.on(dnpsInstalled => {
    store.dispatch(setDnpInstalled(dnpsInstalled));
  });

  /**
   * Periodic updates of the state of all chains bundled together
   * `chainData` is an array and is sent as an `arg` not `kwarg`
   * @param {array} chainData = [{
   *     syncing: true, {bool}
   *     message: "Blocks synced: 543000 / 654000", {string}
   *     progress: 0.83027522935,
   *   }, {
   *     message: "Could not connect to RPC", {string}
   *     error: true {bool},
   *   }, ... ]
   */
  wampSubscriptions.chainData.on(chainsData => {
    store.dispatch(updateChainData(chainsData));
  });

  /**
   * @param {object} notification = {
   *   id: "diskSpaceRanOut-stoppedPackages",
   *   type: "danger",
   *   title: "Disk space ran out, stopped packages",
   *   body: "Available disk space is less than a safe ... ",
   * }
   */
  wampSubscriptions.pushNotification.on(notification => {
    store.dispatch(pushNotificationFromDappmanager(notification));
  });

  /**
   * [VPN] (un-typed)
   *
   * @param {array} devices = [{
   *   id: "MyPhone",
   *   isAdmin: false
   * }, ... ]
   */
  subscribe("devices.vpn.dnp.dappnode.eth", ([devices]: any[]) => {
    store.dispatch(updateDevices(devices));
  });
}
