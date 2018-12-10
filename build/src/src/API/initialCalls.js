import store from "../store";
import * as APIcall from "API/rpcMethods";
import navbar from "navbar";

export default function initialCalls(session) {
  // Execute initial calls

  // Request chainData recursively
  function requestChainData() {
    APIcall.requestChainData().then(res => {
      if (!res.success)
        console.error(`Error requesting chain data: ${res.message}`);
      else setTimeout(requestChainData, 5 * 60 * 1000);
    });
  }
  requestChainData();

  // > result: notifications =
  //   {
  //       "notificiation-id": {
  //          id: 'diskSpaceRanOut-stoppedPackages',
  //          type: 'error',
  //          title: 'Disk space ran out, stopped packages',
  //          body: `Available disk space is less than a safe ...`,
  //       },
  //       ...
  //   }
  APIcall.notificationsGet().then(res => {
    if (!res.success)
      console.error(`Error requesting notifications: ${res.message}`);
    else {
      console.log("Received notifications form the dappmanager", res.result);
      Object.values(res.result || {}).forEach(notification => {
        store.dispatch({
          type: navbar.actionTypes.PUSH_NOTIFICATION,
          notification: { ...notification, fromDappmanager: true }
        });
      });
    }
  });

  //   Execute subscriptions. Dispatch to store example
  //
  //   session.subscribe(
  //     "logUserAction.dappmanager.dnp.dappnode.eth",
  //     (_, userActionLog) => {
  //       store.dispatch({
  //         type: "NEW_USER_ACTION_LOG",
  //         userActionLog
  //       });
  //     }
  //   );
}
