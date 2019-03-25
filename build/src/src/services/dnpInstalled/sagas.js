import { put, call } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import APIcall from "API/rpcMethods";
import * as a from "./actions";
import * as t from "./actionTypes";

// Service > dnpInstalled

function* fetchDnpInstalled() {
  try {
    yield put({ type: "######UPDATE_FETCHING", fetching: true });
    const dnps = yield call(APIcall.listPackages, {}, { toastOnError: true });
    yield put({ type: "######UPDATE_FETCHING", fetching: false });
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
    yield put(a.updateDnpInstalled(dnps));
  } catch (e) {
    console.error(`Error on fetchDnpInstalled: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  ["CONNECTION_OPEN", fetchDnpInstalled],
  [t.FETCH_DNP_INSTALLED, fetchDnpInstalled]
]);
