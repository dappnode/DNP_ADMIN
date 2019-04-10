import * as t from "./actionTypes";
import { assertAction } from "utils/redux";

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
  switch (action.type) {
    case t.CONNECTION_OPEN:
      assertAction(action, { session: {} });
      return {
        ...state,
        isOpen: true,
        session: action.session,
        error: null,
        isNotAdmin: false
      };

    case t.CONNECTION_CLOSE:
      assertAction(action, { session: {}, error: "error", isNotAdmin: true });
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
