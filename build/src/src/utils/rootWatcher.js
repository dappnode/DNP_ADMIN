import { takeEvery, all } from "redux-saga/effects";

/**
 * Utility to standarize the sagas export of each module.
 * It receives an object that maps actionTypes to sagas (generator functions)
 * It returns a function that will constructs an array of sagas using takeEvery.
 *
 * @param {*} watchers = {
 *   ["CONNECTION_OPEN"]: onConnectionOpen,
 *   ["CONNECTION_CLOSE"]: onConnectionClose,
 * }
 */
export default function rootWatcher(watchers) {
  return () =>
    all(
      Object.keys(watchers).map(actionType =>
        takeEvery(actionType, watchers[actionType])
      )
    );
}
