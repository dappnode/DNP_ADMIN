import { call, put, takeEvery, all } from "redux-saga/effects";
import * as APIcall from "API/crossbarCalls";
import * as t from "./actionTypes";
import * as actions from "./actions";

/***************************** Subroutines ************************************/

export function* listPackages() {
  try {
    const packages = yield call(APIcall.listPackages);
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

    // Abort on error
    if (!packages) return;

    // Update packages
    yield put(actions.updatePackages(packages));
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

function* callApi(action) {
  try {
    yield call(APIcall[action.call], action.kwargs);
  } catch (error) {
    console.error("Error on " + action.call + ": ", error);
  }
  yield call(listPackages);
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchListPackages() {
  yield takeEvery(t.LIST_PACKAGES, listPackages);
}

function* watchCall() {
  yield takeEvery(t.CALL, callApi);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchListPackages(), watchCall()]);
}
