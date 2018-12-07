import { call, put, takeEvery, all, select } from "redux-saga/effects";
import * as APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import * as selector from "./selectors";
import Toast from "components/Toast";

// Experiment
import urlencode from "urlencode";

/***************************** Subroutines ************************************/

export function* computeIssueUrl() {
  try {
    const installedPackages = yield select(selector.installedPackages);

    // Craft the github message
    // dnp = {
    //   created: "2018-11-22T03:28:52.000Z"
    //   id: "894c45aa4afcf311d03a9a75bcad2987126c81aa9a9aa6a2adc830ffc4c14937"
    //   image: "vpn.dnp.dappnode.eth:0.1.19"
    //   isCORE: true
    //   isDNP: false
    //   manifest: {name: "vpn.dnp.dappnode.eth", version: "0.1.19", description: "Dappnode package responsible for providing the VPN (L2TP/IPSec) connection", avatar: "/ipfs/QmWwMb3XhuCH6JnCF6m6EQzA4mW9pHHtg7rqAfhDr2ofi8", type: "dncore", …}
    //   name: "vpn.dnp.dappnode.eth"
    //   ports: (2) [{…}, {…}]
    //   portsToClose: []
    //   running: true
    //   shortName: "vpn"
    //   state: "running"
    //   version: "0.1.19"
    //   volumes: (5) [{…}, {…}, {…}, {…}, {…}]
    // }

    const msgVersions = installedPackages
      .filter(dnp => dnp.isCORE)
      .map(dnp => `- **${dnp.name}**: ${dnp.version}`)
      .join("\n");

    let title = "";
    let body = `*Before filing a new issue, please **provide the following information**.*`;
    body += `\n\n## Current versions\n${msgVersions}`;
    body += `\n\n## System info\n${msgVersions}`;
    // eslint-disable-next-line
      const url = `https://github.com/dappnode/DNP_ADMIN/issues/new?title=${urlencode(title)}&body=${urlencode(body)}`;
    console.log(url);
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchComputeIssueUrl() {
  yield takeEvery(t.COMPUTE_ISSUE_URL, computeIssueUrl);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchComputeIssueUrl()]);
}
