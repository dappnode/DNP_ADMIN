import { createAction } from "@reduxjs/toolkit";
import { dappnodeStatus } from "./reducer";

// Service > dappnodeStatus

// Update

export const setSystemInfo = dappnodeStatus.actions.systemInfo;
export const updateDappnodeStats = dappnodeStatus.actions.stats;
export const updateDappnodeDiagnose = dappnodeStatus.actions.diagnose;
export const updateIpfsConnectionStatus =
  dappnodeStatus.actions.ipfsConnectionStatus;
export const updateWifiStatus = dappnodeStatus.actions.wifiStatus;
export const updatePasswordIsInsecure =
  dappnodeStatus.actions.passwordIsInsecure;
export const updateAutoUpdateData = dappnodeStatus.actions.autoUpdateData;
export const updateMountpoints = dappnodeStatus.actions.mountpoints;
export const updateVolumes = dappnodeStatus.actions.volumes;

// Fetch

export const fetchAllDappnodeStatus = createAction("FETCH_ALL_DAPPNODE_STATUS");
export const fetchDappnodeParams = createAction("FETCH_DAPPNODE_PARAMS");
export const fetchDappnodeStats = createAction("FETCH_DAPPNODE_STATS");
export const fetchDappnodeDiagnose = createAction("FETCH_DAPPNODE_DIAGNOSE");
export const fetchPasswordIsInsecure = createAction(
  "FETCH_PASSWORD_IS_INSECURE"
);
export const fetchMountpoints = createAction("FETCH_MOUNTPOINTS");
