import {
  SystemInfo,
  HostStats,
  Diagnose,
  AutoUpdateDataView,
  MountpointData,
  VolumeData
} from "types";
import {
  UPDATE_DAPPNODE_STATS,
  UPDATE_DAPPNODE_DIAGNOSE,
  UPDATE_IPFS_CONNECTION_STATUS,
  UPDATE_WIFI_STATUS,
  UPDATE_PASSWORD_IS_INSECURE,
  UPDATE_AUTO_UPDATE_DATA,
  UPDATE_MOUNTPOINTS,
  UPDATE_VOLUMES,
  FETCH_ALL_DAPPNODE_STATUS,
  FETCH_DAPPNODE_PARAMS,
  FETCH_DAPPNODE_STATS,
  FETCH_DAPPNODE_DIAGNOSE,
  FETCH_IF_PASSWORD_IS_INSECURE,
  FETCH_MOUNTPOINTS,
  SET_SYSTEM_INFO,
  UpdateDappnodeStats,
  UpdateDappnodeDiagnose,
  SetSystemInfo,
  UpdateIpfsConnectionStatus,
  UpdateWifiStatus,
  UpdatePasswordIsInsecure,
  UpdateAutoUpdateData,
  UpdateMountpoints,
  UpdateVolumes
} from "./types";
import { IpfsConnectionStatus, WifiStatus } from "./types";

// Service > dappnodeStatus

// Update

export const setSystemInfo = (systemInfo: SystemInfo): SetSystemInfo => ({
  type: SET_SYSTEM_INFO,
  systemInfo
});

export const updateDappnodeStats = (stats: HostStats): UpdateDappnodeStats => ({
  type: UPDATE_DAPPNODE_STATS,
  stats
});

export const updateDappnodeDiagnose = (
  diagnose: Diagnose
): UpdateDappnodeDiagnose => ({
  type: UPDATE_DAPPNODE_DIAGNOSE,
  diagnose
});

export const updateIpfsConnectionStatus = (
  ipfsConnectionStatus: IpfsConnectionStatus
): UpdateIpfsConnectionStatus => ({
  type: UPDATE_IPFS_CONNECTION_STATUS,
  ipfsConnectionStatus
});

export const updateWifiStatus = (wifiStatus: WifiStatus): UpdateWifiStatus => ({
  type: UPDATE_WIFI_STATUS,
  wifiStatus
});

export const updatePasswordIsInsecure = (
  passwordIsInsecure: boolean
): UpdatePasswordIsInsecure => ({
  type: UPDATE_PASSWORD_IS_INSECURE,
  passwordIsInsecure
});

export const updateAutoUpdateData = (
  autoUpdateData: AutoUpdateDataView
): UpdateAutoUpdateData => ({
  type: UPDATE_AUTO_UPDATE_DATA,
  autoUpdateData
});

export const updateMountpoints = (
  mountpoints: MountpointData[]
): UpdateMountpoints => ({
  type: UPDATE_MOUNTPOINTS,
  mountpoints
});

export const updateVolumes = (volumes: VolumeData[]): UpdateVolumes => ({
  type: UPDATE_VOLUMES,
  volumes
});

// Fetch

export const fetchAllDappnodeStatus = () => ({
  type: FETCH_ALL_DAPPNODE_STATUS
});

export const fetchDappnodeParams = () => ({
  type: FETCH_DAPPNODE_PARAMS
});

export const fetchDappnodeStats = () => ({
  type: FETCH_DAPPNODE_STATS
});

export const fetchDappnodeDiagnose = () => ({
  type: FETCH_DAPPNODE_DIAGNOSE
});

export const fetchIfPasswordIsInsecure = () => ({
  type: FETCH_IF_PASSWORD_IS_INSECURE
});

export const fetchMountpoints = () => ({
  type: FETCH_MOUNTPOINTS
});
