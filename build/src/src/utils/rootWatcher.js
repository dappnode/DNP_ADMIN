import { takeEvery, throttle, all } from "redux-saga/effects";

/**
 * Utility to standarize the sagas export of each module.
 * It receives an object that maps actionTypes to sagas (generator functions)
 * It returns a function that will constructs an array of sagas using takeEvery.
 *
 * @param {*} watchers = [
 *   ["CONNECTION_OPEN", onConnectionOpen],
 *   ["CONNECTION_CLOSE", onConnectionClose],
 *   [t.UPDATE_QUERY, onUpdateQuery, { throttle: 1000 }]
 * ]
 */

/* eslint-disable redux-saga/no-unhandled-errors */

export default function rootWatcher(watchers) {
  return function* rootSingleSaga() {
    yield all(
      watchers.map(([actionType, handler, options = {}]) => {
        if (options.throttle)
          return throttle(options.throttle, actionType, handler);
        else return takeEvery(actionType, handler);
      })
    );
  };
}
