import { put, call } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import { api } from "api";
import * as a from "./actions";
import { connectionOpen } from "services/connectionStatus/actions";

// Service > chainData

/**
 * Instruct the DAPPMANAGER to emit chain data during 5 minutes
 * If the previous request was successful, request again in 5 minutes
 */
function* requestChainData() {
  try {
    yield call(api.requestChainData);
    yield call(async function() {
      await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    });
    yield put(a.requestChainData());
  } catch (e) {
    console.error(`Error on requestChainData: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
export default rootWatcher([
  [connectionOpen.toString(), requestChainData],
  [requestChainData.toString(), requestChainData]
]);
