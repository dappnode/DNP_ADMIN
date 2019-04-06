import store from "../store";
// Actions to push received content
import { pushNotification } from "services/notifications/actions";
import { updateChainData } from "services/chainData/actions";
import { updateDevices } from "services/devices/actions";
import { updateDnpDirectory } from "services/dnpDirectory/actions";
import { updateDnpInstalled } from "services/dnpInstalled/actions";
import { pushUserActionLog } from "services/userActionLogs/actions";
import { updateIsInstallingLog } from "services/isInstallingLogs/actions";

export default function subscriptions(session) {
  /**
   * @param userActionLog = {
   *   event: "installPackage.dappmanager.dnp.dappnode.eth",
   *   kwargs: { id: "rinkeby.dnp.dappnode.eth", ... },
   *   level: "error",
   *   message: "Timeout to cancel expired",
   *   stack: "Error: Timeout to cancel expired↵  ...",
   *   timestamp: "2019-02-01T19:09:16.503Z"
   * }
   */
  session.subscribe(
    "logUserAction.dappmanager.dnp.dappnode.eth",
    (_, userActionLog) => {
      store.dispatch(pushUserActionLog(userActionLog));
    }
  );

  /**
   * @param log = {
   *   pkg: "bitcoin.dnp.dappnode.eth",
   *   msg: "Downloading 75%",
   *   id: "ln.dnp.dappnode.eth"
   * }
   */
  session.subscribe("log.dappmanager.dnp.dappnode.eth", (_, log) => {
    store.dispatch(updateIsInstallingLog(log.pkg, log.msg, log.logId));
  });

  /**
   * @param packages = res.result = [{
   *   id: '927623894...',
   *   isDNP: true,
   *   name: otpweb.dnp.dappnode.eth,
   *   ... (see `api/rpcMethods/dappmanager#listPackages` for more details)
   * }, ... ]
   */
  session.subscribe("packages.dappmanager.dnp.dappnode.eth", (_, res) => {
    if (!res.success)
      return console.error(
        "Error on packages.dappmanager.dnp.dappnode.eth: ",
        res.message
      );
    store.dispatch(updateDnpInstalled(res.result));
  });

  /**
   * @param dnps {
   *   "dnpName.dnp.dappnode.eth": {
   *     name: "dnpName.dnp.dappnode.eth",
   *     manifest: { ... },
   *     ...
   *   }
   * }
   */
  session.subscribe("directory.dappmanager.dnp.dappnode.eth", (_, dnps) => {
    store.dispatch(updateDnpDirectory(dnps));
  });

  /**
   * `devices` can be:
   * - an array and is sent as an `arg`
   * - an object and is sent as a `kwarg`
   * @param devices = [{
   *   id: "MyPhone",
   *   isAdmin: false,
   *   url: "link-to-otp/?id=617824#hdfuisf" (optional),
   *   ip: 172.44.12.4 (optional)
   * }, ... ]
   */
  session.subscribe("devices.vpn.dnp.dappnode.eth", (array, obj) => {
    // Support updates by arg and kwarg, `services/devices/reducer` handles the type conversion
    const devices = (array || []).length ? array : obj;
    store.dispatch(updateDevices(devices));
  });

  /**
   * Periodic updates of the state of all chains bundled together
   * `chainData` is an array and is sent as an `arg` not `kwarg`
   * @param chainData = [{
   *   name: "kovan",
   *   message: "Syncing 5936184/6000000",
   *   syncing: true,
   *   progress: 0.8642
   * }, ... ]
   */
  session.subscribe("chainData.dappmanager.dnp.dappnode.eth", chainData => {
    if (!Array.isArray(chainData))
      return console.error(
        "chainData.dappmanager.dnp.dappnode.eth must return an array"
      );
    store.dispatch(updateChainData(chainData));
  });

  /**
   * @param notification = {
   *   id: "diskSpaceRanOut-stoppedPackages",
   *   type: "danger",
   *   title: "Disk space ran out, stopped packages",
   *   body: "Available disk space is less than a safe ... ",
   * }
   */
  session.subscribe(
    "pushNotification.dappmanager.dnp.dappnode.eth",
    (_, notification) => {
      store.dispatch(pushNotification({ notification, fromDappmanager: true }));
    }
  );
}
