import store from "../store";
import APIcall from "API/rpcMethods";
import navbar from "navbar";
import Toast from "components/toast/Toast";

const updateFetching = (topic, fetching) => ({
  type: "UPDATE_FETCHING",
  topic,
  fetching
});

export default function initialCalls(session) {
  // Execute initial calls

  // Request chainData recursively
  async function requestChainData() {
    const res = await APIcall.requestChainData();
    if (!res.success)
      console.error(`Error requesting chain data: ${res.message}`);
    else setTimeout(requestChainData, 5 * 60 * 1000);
  }
  requestChainData();

  // request notifications
  initialFetchNotifications();

  // request devices
  initialFetchDevices();
}

async function initialFetchDevices() {
  store.dispatch(updateFetching("devices", true));
  const res = await APIcall.listDevices();
  store.dispatch(updateFetching("devices", false));
  if (res.success) {
    console.log("Initial devices", res.result);
    store.dispatch({ type: "UPDATE_DEVICES", devices: res.result });
  } else {
    new Toast(res);
  }
}

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
async function initialFetchNotifications() {
  store.dispatch(updateFetching("notifications", true));
  const res = await APIcall.notificationsGet();
  store.dispatch(updateFetching("notifications", false));
  if (res.success) {
    console.log("Initial notifications", res.result);
    Object.values(res.result || {}).forEach(notification => {
      store.dispatch({
        type: navbar.actionTypes.PUSH_NOTIFICATION,
        notification: { ...notification, fromDappmanager: true }
      });
    });
  } else {
    console.error(`Error requesting notifications: ${res.message}`);
    // new Toast(res);
  }
}
