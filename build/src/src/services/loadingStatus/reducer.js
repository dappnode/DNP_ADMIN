import * as t from "./actionTypes";

// Service > loadingStatus

/**
 * @param state = {
 *   "loading-id": {
 *     isLoading: true,
 *     isLoaded: false,
 *     error: "RPC refused to connect"
 *   }, ... }
 * [Tested]
 */

export default function(state = {}, action) {
  switch (action.type) {
    case t.UPDATE_LOADING:
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: action.loading,
          error: action.error
        }
      };
    case t.UPDATE_IS_LOADING:
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: true
        }
      };

    case t.UPDATE_IS_LOADED:
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
