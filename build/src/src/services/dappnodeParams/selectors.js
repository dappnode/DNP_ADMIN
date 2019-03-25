import { mountPoint } from "./data";
import { createSelector } from "reselect";
import cleanObj from "utils/cleanObj";

// Service > dappnodeParams

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
export const getDappnodeParams = createSelector(
  getLocal,
  local => local.params
);

export const getDappnodeStats = createSelector(
  getLocal,
  local => local.stats
);

export const getDappnodeDiagnose = createSelector(
  getLocal,
  local => local.diagnose
);

export const getPingReturns = createSelector(
  getLocal,
  local => local.pingReturns
);

export const getDappmanagerVersionData = createSelector(
  getPingReturns,
  pingReturns => pingReturns.dappmanager
);

export const getVpnVersionData = createSelector(
  getPingReturns,
  pingReturns => pingReturns.vpn
);

export const getIpfsConnectionStatus = createSelector(
  getLocal,
  local => local.ipfsConnectionStatus
);

export const getDappnodeIdentityClean = createSelector(
  getDappnodeParams,
  ({ ip, name, staticIp, domain }) => {
    const params = cleanObj({
      ip,
      name,
      staticIp,
      domain
    });
    // If the static IP is set, don't show the regular IP
    if (params.staticIp && params.ip) delete params.ip;
    return params;
  }
);

export const getStaticIp = createSelector(
  getDappnodeParams,
  ({ staticIp }) => staticIp
);

export const getUpnpAvailable = createSelector(
  getDappnodeParams,
  ({ staticIp }) => staticIp
);
