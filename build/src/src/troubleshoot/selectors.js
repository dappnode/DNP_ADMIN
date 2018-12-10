// PACKAGES
import { NAME } from "./constants";
import urlencode from "urlencode";

const repo = "DNP_ADMIN";
const username = "dappnode";

function baseUrl(username, repo) {
  return `https://github.com/${username}/${repo}/issues/new`;
}

// Selectors provide a way to query data from the module state.
// While they are not normally named as such in a Redux project, they
// are always present.

// The first argument of connect is a selector in that it selects
// values out of the state atom, and returns an object representing a
// component’s props.

// I would urge that common selectors by placed in the selectors.js
// file so they can not only be reused within the module, but
// potentially be used by other modules in the application.

// I highly recommend that you check out reselect as it provides a
// way to build composable selectors that are automatically memoized.

// From https://jaysoo.ca/2016/02/28/applying-code-organization-rules-to-concrete-redux-code/

// #### EXTERNAL

export const installedPackages = state => state.installedPackages;

// #### INTERNAL

const local = state => state[NAME];
export const diagnoses = state => local(state).diagnoses;
export const issueBody = state => {
  const info = local(state).info;
  // Construct issueUrl from the available info
  let body = `*Before filing a new issue, please **provide the following information**.*`;
  // Append core versions
  if (info.packageList) {
    // dnp = {
    //   name: "vpn.dnp.dappnode.eth"
    //   version: "0.1.19"
    // }
    const msgVersions = info.packageList
      .filter(dnp => dnp.isCORE)
      .map(dnp => `- **${dnp.name}**: ${dnp.version}`);
    body += `\n\n## Current versions\n${msgVersions.join("\n")}`;
  }
  // Append system info
  if (info.diskUsage) {
    // info.diskUsage = "85%"
    let systemInfo = [];
    systemInfo.push(`- **${"disk usage"}**: ${info.diskUsage}`);
    body += `\n\n## System info\n${systemInfo.join("\n")}`;
  }
  return body;
};
export const issueUrl = state => {
  // Construct issueUrl from the available info
  let title = "";
  let body = issueBody(state);
  // Construct issueUrl

  // eslint-disable-next-line
  const issueUrl = `${baseUrl(username, repo)}?title=${urlencode(title)}&body=${urlencode(body)}`;
  return issueUrl;
};
export const issueUrlRaw = state => {
  return `${baseUrl(username, repo)}`;
};
