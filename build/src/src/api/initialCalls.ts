import store from "../store";
import { fetchUserActionLogs } from "services/userActionLogs/actions";
import { fetchNotifications } from "services/notifications/actions";
import { fetchDnpInstalled } from "services/dnpInstalled/actions";
import { fetchCoreUpdateData } from "services/coreUpdate/actions";
import {
  fetchSystemInfo,
  fetchVolumes,
  fetchPasswordIsInsecure,
  fetchWifiStatus
} from "services/dappnodeStatus/actions";

export function initialCallsOnOpen() {
  // @ts-ignore
  store.dispatch(fetchUserActionLogs());
  // @ts-ignore
  store.dispatch(fetchNotifications());
  // @ts-ignore
  store.dispatch(fetchDnpInstalled());
  // @ts-ignore
  store.dispatch(fetchCoreUpdateData());

  // @ts-ignore
  store.dispatch(fetchSystemInfo());
  // @ts-ignore
  store.dispatch(fetchVolumes());
  // @ts-ignore
  store.dispatch(fetchPasswordIsInsecure());
  // @ts-ignore
  store.dispatch(fetchWifiStatus());
}
