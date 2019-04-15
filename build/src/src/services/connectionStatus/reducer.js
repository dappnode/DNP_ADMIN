import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import Joi from "joi";

// Service > connectionStatus

/**
 * [Tested]
 */

const initialState = {
  isOpen: false,
  error: null,
  session: null,
  isNotAdmin: false
};

export default function(state = initialState, action) {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    case t.CONNECTION_OPEN:
      assertActionSchema({
        session: Joi.object().required()
      });
      return {
        ...state,
        isOpen: true,
        session: action.session,
        error: null,
        isNotAdmin: false
      };

    case t.CONNECTION_CLOSE:
      assertActionSchema({
        session: Joi.object().required(),
        error: Joi.string().required(),
        isNotAdmin: Joi.boolean().required()
      });
      return {
        ...state,
        isOpen: false,
        session: action.session,
        error: action.error,
        isNotAdmin: action.isNotAdmin
      };

    default:
      return state;
  }
}
