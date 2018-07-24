import { call, put, takeEvery, all, select } from "redux-saga/effects";
import * as t from "./actionTypes";
import { ethchains } from "./constants";
import * as selector from "./selectors";

/***************************** Subroutines ************************************/

function* installedPackage(action) {
  try {
    // Check which chains are ready
    const name = action.id;
    const chain = ethchains.find(chain => chain.name === name);
    const chains = yield select(selector.chains);
    if (chains.find(chain => chain.name === name)) return;
    // Package form the list is whitelisted and not added to chains array
    yield put(action.addChain(chain));
  } catch (error) {
    console.error("Error checking installed package: ", error);
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchInstalledPackage() {
  yield takeEvery(t.INSTALLED_PACKAGE, installedPackage);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchInstalledPackage()]);
}
