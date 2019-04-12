import { mountPoint } from "./data";
import { createSelector } from "reselect";
import createSelectorSubProp from "utils/createSelectorSubProp";
import { cleanObj } from "utils/objects";

// Service > dappnodeStatus

export const getLocal = createSelector(
  state => state[mountPoint],
  local => local
);

// ip: '85.84.83.82',
// name: 'My-DAppNode',
// staticIp: '85.84.83.82', (Optional)
// domain: '1234acbd.dyndns.io (Optional)
// upnpAvailable: true / false,
// noNatLoopback: true / false,
// alertToOpenPorts: true / false,
// internalIp: 192.168.0.1,

export const getDappnodeParams = createSelectorSubProp(getLocal, "params");
export const getDappnodeStats = createSelectorSubProp(getLocal, "stats");
export const getDappnodeDiagnose = createSelectorSubProp(getLocal, "diagnose");
export const getPingReturns = createSelectorSubProp(getLocal, "pingReturns");
export const getVersionData = createSelectorSubProp(getLocal, "versionData");
export const getIpfsConnectionStatus = createSelectorSubProp(
  getLocal,
  "ipfsConnectionStatus"
);

export const getDappmanagerVersionData = createSelectorSubProp(
  getVersionData,
  "dappmanager"
);
export const getVpnVersionData = createSelectorSubProp(getVersionData, "vpn");

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
export const getDappnodeIdentityClean = createSelector(
  getDappnodeParams,
  ({ ip, name, staticIp, domain }) => {
    const params = cleanObj({ ip, name, staticIp, domain });
    // If the static IP is set, don't show the regular IP
    if (params.staticIp && params.ip) delete params.ip;
    if (params.staticIp) delete params.domain;
    return params;
  }
);

export const getStaticIp = createSelector(
  getDappnodeParams,
  // Asign "" as default value to prevent errors in inputs and react hooks
  ({ staticIp }) => staticIp || ""
);

export const getUpnpAvailable = createSelector(
  getDappnodeParams,
  ({ upnpAvailable }) => upnpAvailable
);
