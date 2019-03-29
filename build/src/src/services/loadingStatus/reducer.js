import * as t from "./actionTypes";
import { assertAction } from "utils/redux";

// Service > loadingStatus

/**
 * @param state = {
 *   "loading-id": {
 *     isLoading: true,
 *     isLoaded: false
 *   }, ... }
 * [Tested]
 */

export default function(state = {}, action) {
  switch (action.type) {
    case t.UPDATE_IS_LOADING:
      assertAction(action, { id: "dnp" });
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: true
        }
      };

    case t.UPDATE_IS_LOADED:
      assertAction(action, { id: "dnp" });
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: false,
          isLoaded: true
        }
      };

    default:
      return state;
  }
}
