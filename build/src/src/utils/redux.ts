import { select, take, takeEvery, all } from "redux-saga/effects";
import { getIsConnectionOpen } from "services/connectionStatus/selectors";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";

/**
 * Blocks the execution of a saga until the WAMP connection is open
 */
export function* assertConnectionOpen() {
  const connectionOpen = yield select(getIsConnectionOpen);
  if (!connectionOpen) {
    yield take(CONNECTION_OPEN);
  }
}

/**
 * Utility to standarize the sagas export of each module.
 * It receives an object that maps actionTypes to sagas (generator functions)
 * It returns a function that will constructs an array of sagas using takeEvery.
 *
 * @param watchers = [
 *   [CONNECTION_OPEN, onConnectionOpen],
 *   [CONNECTION_CLOSE, onConnectionClose],
 *   [t.UPDATE_QUERY, onUpdateQuery, { throttle: 1000 }]
 * ]
 */
export const rootWatcher = (watchers: any[]) =>
  function* rootSingleSaga() {
    yield all(
      watchers.map(([actionType, handler]) => {
        return takeEvery(actionType, handler);
      })
    );
  };
