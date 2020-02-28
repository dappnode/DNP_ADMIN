import * as t from "./types";

// Service > dappnodeStatus

// Update

export const setSystemInfo = systemInfo => ({
  type: t.SET_SYSTEM_INFO,
  systemInfo
});

export const updateDappnodeStats = stats => ({
  type: t.UPDATE_DAPPNODE_STATS,
  stats
});

export const updateDappnodeDiagnose = diagnose => ({
  type: t.UPDATE_DAPPNODE_DIAGNOSE,
  diagnose
});

export const updatePingReturn = (dnp, pingReturn) => ({
  type: t.UPDATE_PING_RETURN,
  dnp,
  pingReturn
});

export const updateIpfsConnectionStatus = ipfsConnectionStatus => ({
  type: t.UPDATE_IPFS_CONNECTION_STATUS,
  ipfsConnectionStatus
});

export const updateWifiStatus = wifiStatus => ({
  type: t.UPDATE_WIFI_STATUS,
  wifiStatus
});

export const updatePasswordIsInsecure = passwordIsInsecure => ({
  type: t.UPDATE_PASSWORD_IS_INSECURE,
  passwordIsInsecure
});

export const updateAutoUpdateData = autoUpdateData => ({
  type: t.UPDATE_AUTO_UPDATE_DATA,
  autoUpdateData
});

export const updateIdentityAddress = identityAddress => ({
  type: t.UPDATE_IDENTITY_ADDRESS,
  identityAddress
});

export const updateMountpoints = mountpoints => ({
  type: t.UPDATE_MOUNTPOINTS,
  mountpoints
});

export const updateVolumes = volumes => ({
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
