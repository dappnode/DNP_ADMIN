// PACKAGES
import { mountPoint } from "./data";
import { createSelector, createStructuredSelector } from "reselect";
import {
  getDappnodeParams,
  getDappnodeStats,
  getDappnodeDiagnose,
  getPingReturns,
  getDappmanagerVersionData,
  getVpnVersionData,
  getIpfsConnectionStatus
} from "services/dappnodeStatus/selectors";
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import {
  getConnectionStatus,
  getIsConnectionOpen
} from "services/connectionStatus/selectors";
import merge from "deepmerge";

const repo = "DNP_ADMIN";
const username = "dappnode";

function baseUrl(username, repo) {
  return `https://github.com/${username}/${repo}/issues/new`;
}

// #### EXTERNAL

export const getInstalledPackages = createSelector(
  state => state.installedPackages,
  installedPackages => installedPackages
);
export const getPackageStatus = createSelector(
  state => state.packageStatus,
  packageStatus => packageStatus
);

// #### INTERNAL

const getLocal = createSelector(
  state => state[mountPoint],
  local => local
);

export const getInfo = createSelector(
  getLocal,
  local => local.info || {}
);

export const getDnpInstalledWithVersionData = createSelector(
  getDnpInstalled,
  getDappmanagerVersionData,
  getVpnVersionData,
  (packageList, dappmanagerVersionData, vpnVersionData) => {
    const adminVersionData = window.versionData;
    return merge(packageList, {
      "dappmanager.dnp.dappnode.eth": dappmanagerVersionData,
      "vpn.dnp.dappnode.eth": vpnVersionData,
      "admin.dnp.dappnode.eth": adminVersionData
    });
  }
);

// Diagnose functions
// ==================

export const getDiagnoseConnection = createSelector(
  getConnectionStatus,
  connectionStatus => ({
    ok: connectionStatus.isOpen,
    msg: connectionStatus.isOpen
      ? "Session is open"
      : `Session is closed: ${connectionStatus.error || ""}`,
    solutions: [
      `You may be disconnected from your DAppNode's VPN. Please make sure your connection is still active`,
      `If you are still connected, disconnect your VPN connection, connect again and refresh this page`
    ]
  })
);

/**
 * To be composed with `createSelector`
 * If connection is not open, the selector returns null
 * @param {Function} selector
 * @return {Function}
 */
function onlyIfConnectionIsOpen(selector) {
  return createSelector(
    getIsConnectionOpen,
    selector,
    (isConnectionOpen, result) => (isConnectionOpen ? result : null)
  );
}

export const getDiagnoseOpenPorts = onlyIfConnectionIsOpen(
  createSelector(
    getDappnodeParams,
    dappnodeParams =>
      dappnodeParams.alertToOpenPorts
        ? {
            ok: false,
            msg:
              "Ports have to be openned and there is no UPnP device available",
            solutions: [
              "If you are capable of openning ports manually, please ignore this error",
              "Your router may have UPnP but it is not turned on yet. Please research if your specific router has UPnP and turn it on"
            ]
          }
        : {
            ok: true,
            msg: "No ports have to be oppened OR the router has UPnP enabled"
          }
  )
);

export const getDiagnoseNoNatLoopback = onlyIfConnectionIsOpen(
  createSelector(
    getDappnodeParams,
    dappnodeParams =>
      dappnodeParams.noNatLoopback
        ? {
            ok: false,
            msg: "No NAT loopback, external IP did not resolve",
            solutions: [
              `Please use the internal IP: ${
                dappnodeParams.internalIp
              } when you are in the same network as your DAppNode`
            ]
          }
        : {
            ok: true,
            msg: "NAT loopback enabled, external IP resolves"
          }
  )
);

export const getDiagnoseDappmanagerConnected = onlyIfConnectionIsOpen(
  createSelector(
    getPingReturns,
    pingReturns => ({
      ok: pingReturns.dappmanager,
      msg: pingReturns.dappmanager
        ? "DAPPMANAGER is connected"
        : "DAPPMANAGER is not connected"
    })
  )
);

export const getDiagnoseVpnConnected = onlyIfConnectionIsOpen(
  createSelector(
    getPingReturns,
    pingReturns => ({
      ok: pingReturns.vpn,
      msg: pingReturns.vpn ? "VPN is connected" : "VPN is not connected"
    })
  )
);

export const getDiagnoseIpfs = createSelector(
  getIpfsConnectionStatus,
  ({ resolves, error }) => ({
    ok: resolves,
    msg: resolves ? "IPFS resolves" : "IPFS is not resolving: " + error,
    solutions: [
      `Go to the system tab and make sure IPFS is running. Otherwise open the package and click 'restart'`,
      `If the problem persist make sure your disk has not run of space; IPFS may malfunction in that case.`
    ]
  })
);

// Add diagnose getters here to be reflected on the App
export const getDiagnoses = createSelector(
  createStructuredSelector({
    getDiagnoseConnection,
    getDiagnoseOpenPorts,
    getDiagnoseNoNatLoopback,
    getDiagnoseDappmanagerConnected,
    getDiagnoseVpnConnected,
    getDiagnoseIpfs
  }),
  diagnosesObj =>
    Object.keys(diagnosesObj)
      // Filter out null diagnoses
      .filter(id => diagnosesObj[id])
      .map(id => ({ ...diagnosesObj[id], id }))
);

// Info gather functions
// =====================

export const getDiskUsage = createSelector(
  getDappnodeStats,
  dappnodeStats => (dappnodeStats || {}).disk
);

// Construct github issue body and text
// ====================================
// - getDappnodeStats
// - getDappnodeDiagnose
// - listPackages

//   dappmanagerDiagnoses = {
//     dockerVersion: {
//       name: 'docker version',
//       result: 'Docker version 18.06.1-ce, build e68fc7a' <or>
//       error: 'sh: docker: not found'
//     },
//     ...
//   }
export const getSystemInfo = createSelector(
  getDiskUsage,
  getDappnodeDiagnose,
  (diskUsage, dappnodeDiagnose) => {
    return {
      diskUsage: { name: "Disk usage", data: diskUsage },
      ...dappnodeDiagnose
    };
  }
);

export const getIssueBody = createSelector(
  getDnpInstalledWithVersionData,
  getSystemInfo,
  (packageList, systemInfo) => {
    // Construct issueUrl from the available info
    let body = `*Before filing a new issue, please **provide the following information**.*`;

    if (Object.keys(packageList).length) {
      // dnp = {
      //   name: "vpn.dnp.dappnode.eth"
      //   version: "0.1.19"
      // }
      const msgVersions = Object.values(packageList)
        .filter(dnp => dnp.isCORE)
        .map(dnp => {
          let versionTag = dnp.version;
          if (dnp.branch && dnp.branch !== "master")
            versionTag += `, branch: ${dnp.branch}`;
          if (dnp.commit) versionTag += `, commit: ${dnp.commit.slice(0, 8)}`;
          return `- **${dnp.name}**: ${versionTag}`;
        });
      body += `\n\n## Current versions\n${msgVersions.join("\n")}`;
    }

    // Append system info
    if (Object.keys(systemInfo).length) {
      console.log({
        systemInfo,
        keys: Object.getOwnPropertyNames(systemInfo),
        keysNormal: Object.keys(systemInfo)
      });
      const systemInfoMessages = Object.values(systemInfo).map(
        item =>
          `- **${item.name}**: ${(item.result || item.error || "").trim()}`
      );
      body += `\n\n## System info\n${systemInfoMessages.join("\n")}`;
    }

    return body;
  }
);

export const getIssueUrl = createSelector(
  getIssueBody,
  body => {
    // Construct issueUrl from the available info
    let title = "";
    // Construct issueUrl
    // eslint-disable-next-line
    const issueUrl = `${baseUrl(username, repo)}?title=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(body)}`;
    return issueUrl;
  }
);

export const getIssueUrlRaw = () => `${baseUrl(username, repo)}`;
