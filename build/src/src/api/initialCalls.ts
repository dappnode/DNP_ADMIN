import store from "../store";
import { fetchDevices } from "services/devices/actions";
import { fetchUserActionLogs } from "services/userActionLogs/actions";
import { fetchNotifications } from "services/notifications/actions";
import { fetchDnpInstalled } from "services/dnpInstalled/actions";

export function initialCallsOnOpen() {
  // @ts-ignore
  store.dispatch(fetchDevices());
  // @ts-ignore
  store.dispatch(fetchUserActionLogs());
  // @ts-ignore
  store.dispatch(fetchNotifications());
  // @ts-ignore
  store.dispatch(fetchDnpInstalled());
}
