import { issueBaseUrl } from "./data";
import {
  createSelector,
  createStructuredSelector,
  OutputSelector
} from "reselect";
import { PackageVersionData } from "types";
import {
  getDappnodeParams,
  getDappnodeStats,
  getDappnodeDiagnose,
  getDappmanagerVersionData,
  getVpnVersionData,
  getIpfsConnectionStatus
} from "services/dappnodeStatus/selectors";
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import {
  getConnectionStatus,
  getIsConnectionOpen
} from "services/connectionStatus/selectors";
import { getIsLoading } from "services/loadingStatus/selectors";
import { DiagnoseResult } from "./types";

type DiagnoseResultOrNull = DiagnoseResult | null;

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
  ({ isOpen, error }): DiagnoseResultOrNull => ({
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
    (dappnodeParams): DiagnoseResultOrNull => {
      if (!dappnodeParams) return null;
      const { alertToOpenPorts } = dappnodeParams;
      return {
        ok: !alertToOpenPorts,
        msg: alertToOpenPorts
          ? "Ports have to be opened and there is no UPnP device available"
          : "No ports have to be opened OR the router has UPnP enabled",
        solutions: [
          "If you are capable of opening ports manually, please ignore this error",
          "Your router may have UPnP but it is not turned on yet. Please research if your specific router has UPnP and turn it on"
        ]
      };
    }
  )
);

const getDiagnoseNoNatLoopback = onlyIfConnectionIsOpen(
  createSelector(
    getDappnodeParams,
    (dappnodeParams): DiagnoseResultOrNull => {
      if (!dappnodeParams) return null;
      const { noNatLoopback, internalIp } = dappnodeParams;
      return {
        ok: !noNatLoopback,
        msg: noNatLoopback
          ? "No NAT loopback, external IP did not resolve"
          : "NAT loopback enabled, external IP resolves",
        solutions: [
          `Please use the internal IP: ${internalIp} when you are in the same network as your DAppNode`
        ]
      };
    }
  )
);

const getDiagnoseIpfs = createSelector(
  getIpfsConnectionStatus,
  getIsLoading.ipfsConnectionStatus,
  (ipfsConnectionStatus, loading): DiagnoseResultOrNull => {
    if (loading) return { loading: true, msg: "Checking if IPFS resolves..." };
    if (!ipfsConnectionStatus) return null;
    return {
      loading,
      ok: ipfsConnectionStatus.resolves,
      msg: loading
        ? "Checking if IPFS resolves..."
        : ipfsConnectionStatus.resolves
        ? "IPFS resolves"
        : "IPFS is not resolving: " + ipfsConnectionStatus.error,
      solutions: [
        `Go to the system tab and make sure IPFS is running. Otherwise open the package and click 'restart'`,
        `If the problem persist make sure your disk has not run of space; IPFS may malfunction in that case.`
      ]
    };
  }
);

const getDiagnoseDiskSpace = createSelector(
  getDappnodeStats,
  getIsLoading.dappnodeStats,
  (stats, loading): DiagnoseResultOrNull => {
    if (loading) return { loading, msg: "Checking disk usage..." };
    if (!stats || !stats.disk) return null;
    const ok = parseInt(stats.disk) < 95;
    return {
      ok,
      msg: ok ? "Disk usage is ok (<95%)" : "Disk usage is over 95%",
      solutions: [
        "If the disk usage gets to 100%, DAppNode will stop working. Please empty some disk space",
        "Locate DAppNode Packages with big volumes such as blockchain nodes and remove their data"
      ]
    };
  }
);

const getDiagnoseCoreDnpsRunning = createSelector(
  getDnpInstalled,
  getIsLoading.dnpInstalled,
  (dnpInstalled, isLoading): DiagnoseResultOrNull => {
    if (isLoading)
      return {
        loading: true,
        msg: "Verifying installed core DAppNode Packages..."
      };

    const mandatoryCoreDnps = [
      "dappmanager.dnp.dappnode.eth",
      "vpn.dnp.dappnode.eth",
      "admin.dnp.dappnode.eth",
      "ipfs.dnp.dappnode.eth",
      "wamp.dnp.dappnode.eth",
      "bind.dnp.dappnode.eth"
    ];
    const notFound = [];
    const notRunning = [];
    for (const coreDnpName of mandatoryCoreDnps) {
      const coreDnp = dnpInstalled.find(({ name }) => name === coreDnpName);
      if (!coreDnp) notFound.push(coreDnpName);
      else if (!coreDnp.running) notRunning.push(coreDnpName);
    }

    const ok = !notFound.length && !notRunning.length;
    let errorMsg = "";
    if (!ok && notFound.length)
      errorMsg += `Core DAppNode Packages ${notFound.join(
        ", "
      )} are not found. `;
    if (!ok && notRunning.length)
      errorMsg += `Core DAppNode Packages ${notFound.join(
        ", "
      )} are not running.`;
    return {
      ok,
      msg: ok ? "All core DAppNode Packages are running" : errorMsg,
      solutions: [
        "Make sure the disk is not too full. If so DAppNode automatically stops the IPFS package to prevent it from becoming un-usable",
        "Go to the System tab and restart each stopped DAppNode Package. Please inspect the logs to understand cause and report it if it was not expected"
      ]
    };
  }
);

// Add diagnose getters here to be reflected on the App
export const getDiagnoses = createSelector(
  createStructuredSelector({
    getDiagnoseConnection,
    getDiagnoseOpenPorts,
    getDiagnoseNoNatLoopback,
    getDiagnoseIpfs,
    getDiagnoseDiskSpace,
    getDiagnoseCoreDnpsRunning
  }),
  (diagnoseObjects): DiagnoseResult[] => {
    const diagnoseResults: DiagnoseResult[] = [];
    for (const diagnose of Object.values(diagnoseObjects)) {
      // Ignore diagnoses that are null
      if (diagnose) diagnoseResults.push(diagnose);
    }
    return diagnoseResults;
  }
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
interface IssueDataItem {
  name: string;
  result?: string;
  error?: string;
}

const getVersionDatas = createStructuredSelector({
  "dappmanager.dnp.dappnode.eth": getDappmanagerVersionData,
  "vpn.dnp.dappnode.eth": getVpnVersionData,
  "admin.dnp.dappnode.eth": () => window.versionData
});

/**
 * Agreggates single info selectors with info comming from the DAPPMANAGER
 *
 * @param {object} dappmanagerDiagnoses = {
 *   dockerVersion: {
 *     name: 'docker version',
 *     result: 'Docker version 18.06.1-ce, build e68fc7a' <or>
 *     error: 'sh: docker: not found'
 *   }, ... }
 *
 * 1. Merges the infoObjects selectors (computed in the UI) with the one from the DAPPMANAGER
 * 2. Filters null infoObjects
 * 3. Extends the infoObject with the id for react purposes
 */
const getSystemInfo = createSelector(
  getDappnodeDiagnose,
  getDappnodeStats,
  (dappmanagerDiagnoses, dappnodeStats): IssueDataItem[] => {
    return [
      // Diagnose items from DAPPMANAGER
      ...dappmanagerDiagnoses,
      // Diagnose items computed locally
      { name: "Disk usage", result: (dappnodeStats || {}).disk }
    ];
  }
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

interface IssueBodySection {
  title: string;
  items: { name: string; data: string }[];
}

export const getIssueBody = createSelector(
  getDnpInstalled,
  getVersionDatas,
  // System info
  getSystemInfo,
  (dnps, versionDatas, systemInfo) => {
    const sections: IssueBodySection[] = [
      {
        title: "Core DAppNode Packages versions",
        items: dnps
          .filter(dnp => dnp.isCore)
          .map(({ name, version }) => ({
            name,
            data: printVersionData(
              version,
              // Using keyof typeof to preserve the typing of the object
              versionDatas[name as keyof typeof versionDatas]
            )
          }))
      },
      {
        title: "System info",
        items: Object.values(systemInfo)
          .filter(Boolean)
          .map(({ name, result, error }) => ({
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
 * Print git version data
 * @param version "0.2.0"
 * @param versionData { version: "0.2.1", branch: "next" }
 * @returns "0.2.0, branch: next"
 */
function printVersionData(
  version: string,
  versionData?: PackageVersionData
): string {
  const { branch, commit, version: gitVersion } = versionData || {};
  return [
    gitVersion || version,
    branch && branch !== "master" && `branch: ${branch}`,
    commit && `commit: ${commit.slice(0, 8)}`
  ]
    .filter(data => data)
    .join(", ");
}

/**
 * To be composed with `createSelector`
 * If connection is not open, the selector returns null
 * @param selector
 * @returns
 */
function onlyIfConnectionIsOpen(
  selector: OutputSelector<
    any,
    DiagnoseResultOrNull,
    (res: any) => DiagnoseResultOrNull
  >
) {
  return createSelector(
    getIsConnectionOpen,
    selector,
    (isConnectionOpen, result) => (isConnectionOpen ? result : null)
  );
}
