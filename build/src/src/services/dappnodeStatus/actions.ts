import * as t from "./types";
import {
  SystemInfo,
  HostStats,
  Diagnose,
  AutoUpdateDataView,
  MountpointData,
  VolumeData
} from "types";

// Service > dappnodeStatus

// Update

export const setSystemInfo = (systemInfo: SystemInfo) => ({
  type: t.SET_SYSTEM_INFO,
  systemInfo
});

export const updateDappnodeStats = (stats: HostStats) => ({
  type: t.UPDATE_DAPPNODE_STATS,
  stats
});

export const updateDappnodeDiagnose = (diagnose: Diagnose) => ({
  type: t.UPDATE_DAPPNODE_DIAGNOSE,
  diagnose
});

export const updateIpfsConnectionStatus = (ipfsConnectionStatus: {
  resolves: boolean;
  error?: string;
}) => ({
  type: t.UPDATE_IPFS_CONNECTION_STATUS,
  ipfsConnectionStatus
});

export const updateWifiStatus = (wifiStatus: { running: boolean }) => ({
  type: t.UPDATE_WIFI_STATUS,
  wifiStatus
});

export const updatePasswordIsInsecure = (passwordIsInsecure: boolean) => ({
  type: t.UPDATE_PASSWORD_IS_INSECURE,
  passwordIsInsecure
});

export const updateAutoUpdateData = (autoUpdateData: AutoUpdateDataView) => ({
  type: t.UPDATE_AUTO_UPDATE_DATA,
  autoUpdateData
});

export const updateIdentityAddress = (identityAddress: string) => ({
  type: t.UPDATE_IDENTITY_ADDRESS,
  identityAddress
});

export const updateMountpoints = (mountpoints: MountpointData[]) => ({
  type: t.UPDATE_MOUNTPOINTS,
  mountpoints
});

export const updateVolumes = (volumes: VolumeData[]) => ({
  type: t.UPDATE_VOLUMES,
  volumes
});

// Fetch

export const fetchAllDappnodeStatus = () => ({
  type: t.FETCH_ALL_DAPPNODE_STATUS
});

export const fetchDappnodeParams = () => ({
  type: t.FETCH_DAPPNODE_PARAMS
});

export const fetchDappnodeStats = () => ({
  type: t.FETCH_DAPPNODE_STATS
});

export const fetchDappnodeDiagnose = () => ({
  type: t.FETCH_DAPPNODE_DIAGNOSE
});

export const fetchIfPasswordIsInsecure = () => ({
  type: t.FETCH_IF_PASSWORD_IS_INSECURE
});

export const fetchMountpoints = () => ({
  type: t.FETCH_MOUNTPOINTS
});
