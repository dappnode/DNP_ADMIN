// DASHBOARD
import { call, put, takeEvery, all, select } from "redux-saga/effects";
import * as APIcall from "API/crossbarCalls";
import * as t from "./actionTypes";
import * as selector from "./selectors";

/***************************** Subroutines ************************************/

// For installer: throttle(ms, pattern, saga, ...args)

export function* getUserActionLogs() {
  try {
    const res = yield call(APIcall.getUserActionLogs);
    // fetchDirectory CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: logs <string>

    // Abort on error
    if (!res) return;

    // Process userActionLogs
    const userActionLogs = res
      .trim()
      .split("\n")
      .map(e => JSON.parse(e));

    // Update userActionLogs
    yield put({ type: t.UPDATE_USERACTIONLOGS, userActionLogs });
  } catch (error) {
    console.error("Error fetching userActionLogs: ", error);
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchConnectionOpen() {
  yield takeEvery("CONNECTION_OPEN", getUserActionLogs);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* root() {
  yield all([watchConnectionOpen()]);
}
