import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import Joi from "joi";

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
    case t.UPDATE_LOADING:
      assertAction(
        action,
        Joi.object({
          id: Joi.string().required(),
          loading: Joi.boolean().required()
        })
      );
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: action.loading
        }
      };
    case t.UPDATE_IS_LOADING:
      assertAction(action, Joi.object({ id: Joi.string().required() }));
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          isLoading: true
        }
      };

    case t.UPDATE_IS_LOADED:
      assertAction(action, Joi.object({ id: Joi.string().required() }));
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
