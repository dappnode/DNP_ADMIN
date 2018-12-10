import { call, put } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import * as APIcall from "API/rpcMethods";
import t from "./actionTypes";
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

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = {
  CONNECTION_OPEN: listPackages,
  [t.CALL]: callApi,
  [t.LOG_PACKAGE]: logPackage
};

export default rootWatcher(watchers);
