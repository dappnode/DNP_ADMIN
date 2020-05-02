import store from "../store";
import { fetchDevices } from "services/devices/actions";
import { fetchUserActionLogs } from "services/userActionLogs/actions";

export function initialCallsOnOpen() {
  // @ts-ignore
  store.dispatch(fetchDevices());
  // @ts-ignore
  store.dispatch(fetchUserActionLogs());
}
