import store from "../store";
import autobahn from "autobahn";
import { Subscriptions } from "../common/subscriptions";
// Actions to push received content
import { pushNotificationFromDappmanager } from "services/notifications/actions";
import { updateChainData } from "services/chainData/actions";
import { updateDevices } from "services/devices/actions";
import { pushUserActionLog } from "services/userActionLogs/actions";
import {
  clearIsInstallingLog,
  updateIsInstallingLog
} from "services/isInstallingLogs/actions";
import {
  updateAutoUpdateData,
  updateVolumes,
  setSystemInfo
} from "services/dappnodeStatus/actions";
import { setDnpInstalled } from "services/dnpInstalled/actions";
import { setDnpDirectory } from "services/dnpDirectory/actions";

export function mapSubscriptionsToRedux(subscriptions: Subscriptions): void {
  subscriptions.autoUpdateData.on(autoUpdateData => {
    store.dispatch(updateAutoUpdateData(autoUpdateData));
  });

  subscriptions.chainData.on(chainsData => {
    store.dispatch(updateChainData(chainsData));
  });

  subscriptions.directory.on(directoryDnps => {
    store.dispatch(setDnpDirectory(directoryDnps));
  });

  subscriptions.packages.on(dnpsInstalled => {
    store.dispatch(setDnpInstalled(dnpsInstalled));
  });

  subscriptions.progressLog.on(progressLog => {
    const { id, name: dnpName, message: log, clear } = progressLog;
    if (clear) store.dispatch(clearIsInstallingLog({ id }));
    else store.dispatch(updateIsInstallingLog({ id, dnpName, log }));
  });

  subscriptions.pushNotification.on(notification => {
    store.dispatch(pushNotificationFromDappmanager(notification));
  });

  subscriptions.systemInfo.on(systemInfo => {
    store.dispatch(setSystemInfo(systemInfo));
  });

  subscriptions.userActionLog.on(userActionLog => {
    store.dispatch(pushUserActionLog(userActionLog));
  });

  subscriptions.volumes.on(volumes => {
    store.dispatch(updateVolumes(volumes));
  });

  // The DAPPMANAGER may ask the UI to reload
  subscriptions.reloadClient.on(data => {
    console.log(`DAPPMANAGER triggered a client reload`, data);
    // If we needed to pull the document from the web-server again (such as where
    // the document contents change dynamically) we would pass the argument as 'true'.
    window.location.reload(true);
  });
}

export function legacyVpnSubscription(session: autobahn.Session) {
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
