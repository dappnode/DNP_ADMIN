import { put, call } from "redux-saga/effects";
import * as a from "./actions";
import { capitalize } from "utils/strings";

/**
 * [NOTE] Using updateLoadingById to get immediate errors if the loadingId does not match
 * @param {string} id
 * @param {function} fn
 */
export function wrapErrorsAndLoading(id: string, fn: any): any {
  return function*(action: any) {
    try {
      yield put(a.updateLoading({ id, loading: true }));
      const res = yield call(fn, action);
      yield put(a.updateLoading({ id, loading: false }));
      return res;
    } catch (e) {
      yield put(a.updateLoading({ id, loading: false, error: e.message }));
      console.error(`Error on fetch ${capitalize(id)}: ${e.stack}`);
    }
  };
}
