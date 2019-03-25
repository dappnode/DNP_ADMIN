import store from "../store";
import { pushNotificationFromDappmanager } from "services/notifications/actions";
import { updateChainData } from "services/chainData/actions";
import { updateDevices } from "services/devices/actions";
import { updateDnpDirectory } from "services/dnpDirectory/actions";
import { updateDnpInstalled } from "services/dnpInstalled/actions";
import { pushUserActionLog } from "services/userActionLogs/actions";

export default function subscriptions(session) {
  session.subscribe(
    "logUserAction.dappmanager.dnp.dappnode.eth",
    (_, userActionLog) => {
      store.dispatch(pushUserActionLog(userActionLog));
    }
  );

  session.subscribe("log.dappmanager.dnp.dappnode.eth", (_, log) => {
    store.dispatch({
      type: "installer/PROGRESS_LOG",
      logId: log.logId,
      msg: log.msg,
      pkgName: log.pkg
    });
  });

  session.subscribe("packages.dappmanager.dnp.dappnode.eth", (_, res) => {
    if (!res.success)
      return console.error(
        "Error on packages.dappmanager.dnp.dappnode.eth: ",
        res.message
      );
    store.dispatch(updateDnpInstalled(res.result));
  });

  session.subscribe("directory.dappmanager.dnp.dappnode.eth", (_, dnps) => {
    store.dispatch(updateDnpDirectory(dnps));
  });

  // devices is an array and is sent as an arg not kwarg
  session.subscribe("devices.vpn.dnp.dappnode.eth", devices => {
    if (!Array.isArray(devices))
      return console.error("devices.vpn.dnp.dappnode.eth must return an array");
    store.dispatch(updateDevices(devices));
  });

  // chain is an array and is sent as an arg not kwarg
  session.subscribe("chainData.dappmanager.dnp.dappnode.eth", chainData => {
    if (!Array.isArray(chainData))
      return console.error(
        "chainData.dappmanager.dnp.dappnode.eth must return an array"
      );
    store.dispatch(updateChainData(chainData));
  });

  session.subscribe(
    "pushNotification.dappmanager.dnp.dappnode.eth",
    (_, notification) => {
      store.dispatch(pushNotificationFromDappmanager(notification));
    }
  );
}
