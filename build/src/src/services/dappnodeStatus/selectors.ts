import { mountPoint, autoUpdateIds } from "./data";
import { createSelector } from "reselect";
import { DappnodeStatusState } from "./types";
import { getEthClientPrettyStatusError } from "components/EthMultiClient";

// Service > dappnodeStatus

export const getLocal = (state: any): DappnodeStatusState => state[mountPoint];

// Sub-local properties
export const getSystemInfo = (state: any) => getLocal(state).systemInfo;
export const getDappnodeParams = getSystemInfo;
export const getDappnodeStats = (state: any) => getLocal(state).stats;
export const getDappnodeDiagnose = (state: any) => getLocal(state).diagnose;
export const getPing = (state: any) => getLocal(state).pingReturns;
export const getVersionData = (state: any) =>
  (getLocal(state).systemInfo || {}).versionData;
export const getIpfsConnectionStatus = (state: any) =>
  getLocal(state).ipfsConnectionStatus;
export const getWifiStatus = (state: any) => getLocal(state).wifiStatus;
export const getPasswordIsInsecure = (state: any) =>
  getLocal(state).passwordIsInsecure;
export const getAutoUpdateData = (state: any) => getLocal(state).autoUpdateData;
export const getIdentityAddress = (state: any) =>
  (getSystemInfo(state) || {}).identityAddress;
export const getMountpoints = (state: any) => getLocal(state).mountpoints;
export const getVolumes = (state: any) => getLocal(state).volumes;

// Sub-sub local properties
export const getDappmanagerVersionData = (state: any) =>
  (getSystemInfo(state) || {}).versionData;
export const getVpnVersionData = (state: any) => getLocal(state).vpnVersionData;
export const getDappmanagerPing = (state: any) => getPing(state).dappmanager;
export const getVpnPing = (state: any) => getPing(state).vpn;
export const getEthClientTarget = (state: any) =>
  (getSystemInfo(state) || {}).ethClientTarget;
export const getEthClientFallback = (state: any) =>
  (getSystemInfo(state) || {}).ethClientFallback;
export const getEthClientStatus = (state: any) =>
  (getSystemInfo(state) || {}).ethClientStatus;
export const getNewFeatureIds = (state: any) =>
  (getSystemInfo(state) || {}).newFeatureIds;

/**
 * Returns a pretty warning about the eth client only if the user has to see it
 * @param state
 */
export const getEthClientWarning = (state: any): string | null => {
  const ethClientFallback = getEthClientFallback(state);
  const ethClientStatus = getEthClientStatus(state);
  if (ethClientStatus && !ethClientStatus.ok && ethClientFallback === "off")
    return getEthClientPrettyStatusError(ethClientStatus);
  else return null;
};

/**
 * Returns the DAppNode "network" identity to be shown in the TopBar
 * @returns {object} params = {
 *   name: "MyDappNode",
 *   staticIp: "85.84.83.82" (optional)
 *   domain: "ab318d2.dyndns.io" (optional, if no staticIp)
 *   ip: "85.84.83.82" (optional, if no staticIp)
 * }
 * [Tested]
 */
export const getDappnodeIdentityClean = (state: any) => {
  const systemInfo = getSystemInfo(state);
  if (systemInfo) {
    // If the static IP is set, don't show the regular IP
    const { ip, name, staticIp, domain } = systemInfo;
    if (staticIp) return { name, staticIp };
    else return { name, domain, ip };
  } else {
    return {};
  }
};

export const getStaticIp = (state: any) =>
  (getSystemInfo(state) || {}).staticIp || "";

export const getUpnpAvailable = (state: any) =>
  (getSystemInfo(state) || {}).upnpAvailable;

export const getIsWifiRunning = (state: any) =>
  (getWifiStatus(state) || {}).running;

export const getIsCoreAutoUpdateActive = createSelector(
  getAutoUpdateData,
  autoUpdateData =>
    (
      ((autoUpdateData || {}).settings || {})[autoUpdateIds.SYSTEM_PACKAGES] ||
      {}
    ).enabled
);
