// WATCHERS
import * as t from "./actionTypes";

export const updateStatus = status => ({
  type: t.UPDATE_STATUS,
  payload: status
});

export const startIpfsMonitor = () => ({
  type: t.IPFS_START
});

export const startWampMonitor = () => ({
  type: t.WAMP_START
});

export const stop = () => ({
  type: t.STOP
});
