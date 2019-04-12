// PACKAGES
import { issueBaseUrl } from "./data";
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

/**
 * Diagnose selectors
 * ==================
 *
 * Must return an object as:
 *
 * {
 *   ok: {Boolean},
 *   msg: {string} (short description),
 *   solutions: {array}
 * }
 *
 * can also return null, and that diagnose will be ignored
 */

const getDiagnoseConnection = createSelector(
  getConnectionStatus,
  ({ isOpen, error }) => ({
    ok: isOpen,
    msg: isOpen ? "Session is open" : `Session is closed: ${error || ""}`,
    solutions: [
      `You may be disconnected from your DAppNode's VPN. Please make sure your connection is still active`,
      `If you are still connected, disconnect your VPN connection, connect again and refresh this page`
    ]
  })
);

const getDiagnoseOpenPorts = onlyIfConnectionIsOpen(
  createSelector(
    getDappnodeParams,
    ({ alertToOpenPorts }) => ({
      ok: !alertToOpenPorts,
      msg: alertToOpenPorts
        ? "Ports have to be openned and there is no UPnP device available"
        : "No ports have to be oppened OR the router has UPnP enabled",
      solutions: [
        "If you are capable of openning ports manually, please ignore this error",
        "Your router may have UPnP but it is not turned on yet. Please research if your specific router has UPnP and turn it on"
      ]
    })
  )
);

const getDiagnoseNoNatLoopback = onlyIfConnectionIsOpen(
  createSelector(
    getDappnodeParams,
    ({ noNatLoopback, internalIp }) => ({
      ok: !noNatLoopback,
      msg: noNatLoopback
        ? "No NAT loopback, external IP did not resolve"
        : "NAT loopback enabled, external IP resolves",
      solutions: [
        `Please use the internal IP: ${internalIp} when you are in the same network as your DAppNode`
      ]
    })
  )
);

const getDiagnoseDappmanagerConnected = onlyIfConnectionIsOpen(
  createSelector(
    getDappmanagerVersionData,
    ok => ({
      ok: Boolean(ok),
      msg: ok ? "DAPPMANAGER is connected" : "DAPPMANAGER is not connected",
      solutions: [
        "Close your VPN connection and connect again",
        "If the problem persists, reset the DAppNode machine"
      ]
    })
  )
);

const getDiagnoseVpnConnected = onlyIfConnectionIsOpen(
  createSelector(
    getVpnVersionData,
    ok => ({
      ok: Boolean(ok),
      msg: ok ? "VPN is connected" : "VPN is not connected",
      solutions: [
        "Close your VPN connection and connect again",
        "If the problem persists, reset the DAppNode machine"
      ]
    })
  )
);

const getDiagnoseIpfs = createSelector(
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
  diagnoseObjects =>
    Object.keys(diagnoseObjects)
      // Filter out null diagnoses
      .filter(id => diagnoseObjects[id])
      // The id is used by react as key={id}
      .map(id => ({ ...diagnoseObjects[id], id }))
);

/**
 * Info selectors
 * ==============
 *
 * Must return an object as:
 *
 * {
 *   name: {string},
 *   result: {string}, (or)
 *   error: {string}
 * }
 */

const getDiskUsageInfo = createSelector(
  getDappnodeStats,
  dappnodeStats => ({
    name: "Disk usage",
    result: (dappnodeStats || {}).disk
  })
);

const getDnpInstalledWithVersionData = createSelector(
  getDnpInstalled,
  createStructuredSelector({
    "dappmanager.dnp.dappnode.eth": getDappmanagerVersionData,
    "vpn.dnp.dappnode.eth": getVpnVersionData,
    "admin.dnp.dappnode.eth": () => window.versionData
  }),
  (dnps, versionDatas) =>
    dnps.map(dnp => ({ ...dnp, ...(versionDatas[dnp.name] || {}) }))
);

/**
 * Agreggates single info selectors with info comming from the DAPPMANAGER
 *
 * dappmanagerDiagnoses = {
 *   dockerVersion: {
 *     name: 'docker version',
 *     result: 'Docker version 18.06.1-ce, build e68fc7a' <or>
 *     error: 'sh: docker: not found'
 *   }, ... }
 */
const getSystemInfo = createSelector(
  createStructuredSelector({
    ...getDappnodeDiagnose,
    getDiskUsageInfo
  }),
  infoObjects =>
    Object.keys(infoObjects)
      .filter(id => infoObjects[id])
      .map(id => ({ ...infoObjects[id], id }))
);

/**
 * Construct github issue
 * ======================
 *
 * Before filing a new issue...
 *
 * Core DNPs versions
 * - admin.dnp.dappnode.eth: 0.1.18
 * ...
 *
 * System info
 * - docker version:
 * ...
 */

export const getIssueBody = createSelector(
  getDnpInstalledWithVersionData,
  getSystemInfo,
  (dnps, systemInfo) => {
    const sections = [
      {
        title: "Core DNPs versions",
        items: dnps
          .filter(dnp => dnp.isCORE)
          .map(({ name, version, branch, commit }) => ({
            name,
            data:
              version +
              (branch && branch !== "master" ? `, branch: ${branch}` : "") +
              (commit ? `, commit: ${commit.slice(0, 8)}` : "")
          }))
      },
      {
        title: "System info",
        items: Object.values(systemInfo).map(({ name, result, error }) => ({
          name,
          data: (result || error || "").trim()
        }))
      }
    ];

    return [
      "*Before filing a new issue, please **provide the following information**.*",
      ...sections
        .filter(({ items }) => items.length)
        .map(
          ({ title, items }) =>
            `## ${title}\n` +
            items.map(({ name, data }) => `- **${name}**: ${data}`).join("\n")
        )
    ].join("\n\n");
  }
);

export const getIssueUrl = createSelector(
  getIssueBody,
  body => {
    // Construct issueUrl from the available info
    const title = "";
    const params = [
      "title=" + encodeURIComponent(title),
      "body=" + encodeURIComponent(body)
    ];
    return issueBaseUrl + "?" + params.join("&");
  }
);

export const getIssueUrlRaw = () => issueBaseUrl;

/**
 * Utilities
 * =========
 */

/**
 * To be composed with `createSelector`
 * If connection is not open, the selector returns null
 * @param {Function} selector
 * @returns {Function}
 */
function onlyIfConnectionIsOpen(selector) {
  return createSelector(
    getIsConnectionOpen,
    selector,
    (isConnectionOpen, result) => (isConnectionOpen ? result : null)
  );
}
