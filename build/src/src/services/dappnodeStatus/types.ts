import {
  SystemInfo,
  HostStats,
  Diagnose,
  MountpointData,
  VolumeData,
  AutoUpdateDataView
} from "types";

// Service > dappnodeStatus

export interface DappnodeStatusState {
  systemInfo: SystemInfo | null;
  stats: HostStats;
  diagnose: Diagnose;
  ipfsConnectionStatus: {
    resolves?: boolean;
    error?: string;
  };
  wifiStatus: { running?: boolean };
  passwordIsInsecure: boolean;
  autoUpdateData: AutoUpdateDataView | null;
  mountpoints: MountpointData[];
  volumes: VolumeData[];
}

// Update: triggers a reducer
export const UPDATE_DAPPNODE_PARAMS = "UPDATE_DAPPNODE_PARAMS";
export const UPDATE_DAPPNODE_STATS = "UPDATE_DAPPNODE_STATS";
export const UPDATE_DAPPNODE_DIAGNOSE = "UPDATE_DAPPNODE_DIAGNOSE";
export const UPDATE_IPFS_CONNECTION_STATUS = "UPDATE_IPFS_CONNECTION_STATUS";
export const UPDATE_WIFI_STATUS = "UPDATE_WIFI_STATUS";
export const UPDATE_PASSWORD_IS_INSECURE = "UPDATE_PASSWORD_IS_INSECURE";
export const UPDATE_AUTO_UPDATE_DATA = "UPDATE_AUTO_UPDATE_DATA";
export const UPDATE_IDENTITY_ADDRESS = "UPDATE_IDENTITY_ADDRESS";
export const UPDATE_MOUNTPOINTS = "UPDATE_MOUNTPOINTS";
export const UPDATE_VOLUMES = "UPDATE_VOLUMES";
export const SET_SYSTEM_INFO = "SET_SYSTEM_INFO";
// Fetch: triggers a saga
export const FETCH_ALL_DAPPNODE_STATUS = "FETCH_ALL_DAPPNODE_STATUS";
export const FETCH_DAPPNODE_PARAMS = "FETCH_DAPPNODE_PARAMS";
export const FETCH_DAPPNODE_STATS = "FETCH_DAPPNODE_STATS";
export const FETCH_DAPPNODE_DIAGNOSE = "FETCH_DAPPNODE_DIAGNOSE";
export const FETCH_IF_PASSWORD_IS_INSECURE = "FETCH_IF_PASSWORD_IS_INSECURE";
export const FETCH_MOUNTPOINTS = "FETCH_MOUNTPOINTS";
