import { issueBaseUrl } from "./data";
import { createSelector } from "reselect";
import { PackageVersionData } from "types";
import {
  getDappnodeStats,
  getDappnodeDiagnose,
  getDappmanagerVersionData,
  getVpnVersionData
} from "services/dappnodeStatus/selectors";
import { getDnpInstalled } from "services/dnpInstalled/selectors";
import { RootState } from "rootReducer";

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

const getVersionDatas = (state: RootState) => ({
  "dappmanager.dnp.dappnode.eth": getDappmanagerVersionData(state),
  "vpn.dnp.dappnode.eth": getVpnVersionData(state),
  "admin.dnp.dappnode.eth": window.versionData
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
