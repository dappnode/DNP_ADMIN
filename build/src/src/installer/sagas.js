import { call, put, takeEvery, all } from "redux-saga/effects";
import * as APIcall from "API/crossbarCalls";
import * as t from "./actionTypes";

/***************************** Subroutines ************************************/

// For installer: throttle(ms, pattern, saga, ...args)

export function* fetchDirectory() {
  try {
    yield put({ type: t.UPDATE_FETCHING, fetching: true });
    const directory = yield call(APIcall.fetchDirectory);
    yield put({ type: t.UPDATE_FETCHING, fetching: false });
    // fetchDirectory CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: [{
    //     name,
    //     status
    //   },
    //   ...]

    // Abort on error
    if (!directory) return;

    // Update directory
    yield put({ type: t.UPDATE_DIRECTORY, directory });
    yield all(directory.map(pkg => call(fetchPackageData, pkg)));
  } catch (error) {
    console.error("Error fetching directory: ", error);
  }
}

export function* fetchPackageData(pkg) {
  try {
    // Send basic package info immediately for progressive loading appearance
    yield put({ type: t.UPDATE_PACKAGE, data: pkg, id: pkg.name });
    const packageData = yield call(APIcall.fetchPackageData, {
      id: pkg.name
    });
    // fetchPackageData CALL DOCUMENTATION:
    // > kwargs: { id }
    // > result: {
    //     manifest,
    //     avatar
    //   }
    yield put({ type: t.UPDATE_PACKAGE, data: packageData, id: pkg.name });
  } catch (error) {
    console.error("Error getting package data: ", error);
  }
}

function* callApi(action) {
  try {
    yield call(APIcall[action.call], { id: action.id });
  } catch (error) {
    console.error("Error on " + action.call + ": ", error);
  }
  yield call(fetchDirectory);
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchFetchDirectory() {
  yield takeEvery(t.FETCH_DIRECTORY, fetchDirectory);
}

function* watchCall() {
  yield takeEvery("TODO", callApi);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchFetchDirectory(), watchCall()]);
}
