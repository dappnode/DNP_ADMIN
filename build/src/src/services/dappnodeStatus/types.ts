import {
  SystemInfo,
  HostStats,
  Diagnose,
  MountpointData,
  VolumeData,
  AutoUpdateDataView,
} from "types";

// Service > dappnodeStatus

export interface DappnodeStatusState {
  systemInfo: SystemInfo | null;
  stats: HostStats;
  diagnose: Diagnose;
  ipfsConnectionStatus: IpfsConnectionStatus | null;
  wifiStatus: WifiStatus | null;
  passwordIsInsecure: boolean;
  autoUpdateData: AutoUpdateDataView | null;
  mountpoints: MountpointData[];
  volumes: VolumeData[];
}

export interface IpfsConnectionStatus {
  resolves: boolean;
  error?: string;
}

export interface WifiStatus {
  running: boolean;
}

// Update: triggers a reducer
export const UPDATE_DAPPNODE_PARAMS = "UPDATE_DAPPNODE_PARAMS";
export const UPDATE_DAPPNODE_STATS = "UPDATE_DAPPNODE_STATS";
export const UPDATE_DAPPNODE_DIAGNOSE = "UPDATE_DAPPNODE_DIAGNOSE";
export const UPDATE_IPFS_CONNECTION_STATUS = "UPDATE_IPFS_CONNECTION_STATUS";
export const UPDATE_WIFI_STATUS = "UPDATE_WIFI_STATUS";
export const UPDATE_PASSWORD_IS_INSECURE = "UPDATE_PASSWORD_IS_INSECURE";
export const UPDATE_AUTO_UPDATE_DATA = "UPDATE_AUTO_UPDATE_DATA";
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

export type AllReducerActions =
  | SetSystemInfo
  | UpdateDappnodeStats
  | UpdateDappnodeDiagnose
  | UpdateIpfsConnectionStatus
  | UpdateWifiStatus
  | UpdatePasswordIsInsecure
  | UpdateAutoUpdateData
  | UpdateMountpoints
  | UpdateVolumes;

export interface SetSystemInfo {
  type: typeof SET_SYSTEM_INFO;
  systemInfo: SystemInfo;
}

export interface UpdateDappnodeStats {
  type: typeof UPDATE_DAPPNODE_STATS;
  stats: HostStats;
}

export interface UpdateDappnodeDiagnose {
  type: typeof UPDATE_DAPPNODE_DIAGNOSE;
  diagnose: Diagnose;
}

export interface UpdateIpfsConnectionStatus {
  type: typeof UPDATE_IPFS_CONNECTION_STATUS;
  ipfsConnectionStatus: IpfsConnectionStatus;
}

export interface UpdateWifiStatus {
  type: typeof UPDATE_WIFI_STATUS;
  wifiStatus: WifiStatus;
}

export interface UpdatePasswordIsInsecure {
  type: typeof UPDATE_PASSWORD_IS_INSECURE;
  passwordIsInsecure: boolean;
}

export interface UpdateAutoUpdateData {
  type: typeof UPDATE_AUTO_UPDATE_DATA;
  autoUpdateData: AutoUpdateDataView;
}

export interface UpdateMountpoints {
  type: typeof UPDATE_MOUNTPOINTS;
  mountpoints: MountpointData[];
}

export interface UpdateVolumes {
  type: typeof UPDATE_VOLUMES;
  volumes: VolumeData[];
}
