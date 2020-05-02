import {
  UPDATE_LOADING,
  UPDATE_IS_LOADING,
  UPDATE_IS_LOADED,
  LoadingStatusState,
  AllReducerActions
} from "./types";
import { Reducer } from "redux";

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

export const reducer: Reducer<LoadingStatusState, AllReducerActions> = (
  state = {},
  action
) => {
  switch (action.type) {
    case UPDATE_LOADING:
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: action.loading,
          error: action.error
        }
      };
    case UPDATE_IS_LOADING:
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: true
        }
      };

    case UPDATE_IS_LOADED:
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
};
