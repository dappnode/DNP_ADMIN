import { call, put, takeEvery, all } from "redux-saga/effects";
import * as APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import Toast from "components/Toast";
import PubSub from "eventBus";

// Experiment
import urlencode from "urlencode";

/***************************** Subroutines ************************************/

export function* listPackages() {
  try {
    yield put({ type: t.UPDATE_FETCHING, fetching: true });
    const res = yield call(APIcall.listPackages);
    yield put({ type: t.UPDATE_FETCHING, fetching: false });
    if (res.success) {
      yield put(a.updatePackages(res.result));
      yield put({ type: t.HAS_FETCHED_PACKAGES });

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

      const msgVersions = res.result
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
    } else {
      new Toast(res);
    }

    // listPackages CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: [{
    //     id: '927623894...', (string)
    //     isDNP: true, (boolean)
    //     created: <Date string>,
    //     image: <Image Name>, (string)
    //     name: otpweb.dnp.dappnode.eth, (string)
    //     shortName: otpweb, (string)
    //     version: '0.0.4', (string)
    //     ports: <list of ports>, (string)
    //     state: 'exited', (string)
    //     running: true, (boolean)
    //     ...
    //     envs: <Env variables> (object)
    //   },
    //   ...]
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

function* callApi({ method, kwargs, message }) {
  try {
    const pendingToast = new Toast({ message, pending: true });
    const res = yield call(APIcall[method], kwargs);
    pendingToast.resolve(res);
  } catch (error) {
    console.error("Error on " + method + ": ", error);
  }
}

function* logPackage({ kwargs }) {
  const { id } = kwargs;
  try {
    const res = yield call(APIcall.logPackage, kwargs);
    if (res.success) {
      const { logs } = res.result || {};
      if (!logs) {
        yield put(a.updateLog("Error, logs missing", id));
      } else if (logs === "") {
        yield put(a.updateLog("Received empty logs", id));
      } else {
        yield put(a.updateLog(logs, id));
      }
    } else {
      yield put(a.updateLog("Error logging package: \n" + res.message, id));
      PubSub.publish("LOG_ERROR");
    }
  } catch (e) {
    console.error("Error getting package logs:", e);
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchListPackages() {
  yield takeEvery("CONNECTION_OPEN", listPackages);
}

function* watchCall() {
  yield takeEvery(t.CALL, callApi);
}

function* watchLogPackage() {
  yield takeEvery(t.LOG_PACKAGE, logPackage);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchListPackages(), watchCall(), watchLogPackage()]);
}
