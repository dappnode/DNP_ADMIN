import store from "../store";

export default function socketSubscriptions(session) {
  session.subscribe(
    "logUserAction.dappmanager.dnp.dappnode.eth",
    (_, userActionLog) => {
      store.dispatch({
        type: "NEW_USER_ACTION_LOG",
        userActionLog
      });
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
    if (res.success) {
      store.dispatch({
        type: "UPDATE_INSTALLED_PACKAGES",
        packages: res.result
      });
    } else {
      console.error("Error receiving packages: ", res.message);
    }
  });

  session.subscribe("directory.dappmanager.dnp.dappnode.eth", (_, pkgs) => {
    store.dispatch({
      type: "UPDATE_DIRECTORY",
      pkgs
    });
  });

  // devices is an array and is sent as an arg not kwarg
  session.subscribe("devices.vpn.dnp.dappnode.eth", (devices) => {
    if (!Array.isArray(devices)) return
    store.dispatch({
      type: "UPDATE_DEVICES",
      devices
    });
  });
}
