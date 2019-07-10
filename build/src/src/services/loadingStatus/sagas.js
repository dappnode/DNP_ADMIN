import { put, call } from "redux-saga/effects";
import * as a from "./actions";
import { capitalize } from "utils/strings";

/**
 * [NOTE] Using updateLoadingById to get immediate errors if the loadingId does not match
 * @param {string} id
 * @param {function} fn
 */
export function wrapErrorsAndLoading(id, fn) {
  return function*(action) {
    try {
      yield put(a.updateLoading(id, true));
      const res = yield call(fn, action);
      yield put(a.updateLoading(id, false));
      return res;
    } catch (e) {
      yield put(a.updateLoading(id, false, e.message));
      console.error(`Error on fetch ${capitalize(id)}: ${e.stack}`);
    }
  };
}
