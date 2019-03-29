import { assertObjTypes } from "./objects";
import { select, take, takeEvery, throttle, all } from "redux-saga/effects";
import { getIsConnectionOpen } from "services/connectionStatus/selectors";
import { CONNECTION_OPEN } from "services/connectionStatus/actionTypes";

/* eslint-disable redux-saga/no-unhandled-errors */

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
 * Ease way to assert styles in a reducer
 *   case t.MY_ACTION:
 *     assertAction(action, { id: "someId", data: {} });
 *     return { ...state, [action.id]: action.data };
 * @param {Object} action
 * @param {Object} referenceTypes
 */
export function assertAction(action, referenceTypes) {
  assertObjTypes(action, referenceTypes, `action ${action.type}`);
}

/**
 * Utility to standarize the sagas export of each module.
 * It receives an object that maps actionTypes to sagas (generator functions)
 * It returns a function that will constructs an array of sagas using takeEvery.
 *
 * @param {*} watchers = [
 *   [CONNECTION_OPEN, onConnectionOpen],
 *   [CONNECTION_CLOSE, onConnectionClose],
 *   [t.UPDATE_QUERY, onUpdateQuery, { throttle: 1000 }]
 * ]
 */
export const rootWatcher = watchers =>
  function* rootSingleSaga() {
    yield all(
      watchers.map(([actionType, handler, options = {}]) => {
        if (options.throttle)
          return throttle(options.throttle, actionType, handler);
        else return takeEvery(actionType, handler);
      })
    );
  };

/**
 * Higher order function.
 * Wraps an async function and logs any errors
 * @param {Function} fn
 * @returns {Function}
 */
export const handleErrors = fn =>
  async function(...args) {
    try {
      await fn(...args);
    } catch (e) {
      console.error(`Redux-thunk error hanlder: ${e.stack}`);
    }
  };
