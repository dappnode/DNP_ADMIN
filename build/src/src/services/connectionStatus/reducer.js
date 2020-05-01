import * as t from "./actionTypes";

// Service > connectionStatus

/**
 * [Tested]
 */

const initialState = {
  isOpen: false,
  error: null,
  isNotAdmin: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.CONNECTION_OPEN:
      return {
        ...state,
        isOpen: true,
        error: null,
        isNotAdmin: false
      };

    case t.CONNECTION_CLOSE:
      return {
        ...state,
        isOpen: false,
        error: action.error,
        isNotAdmin: action.isNotAdmin
      };

    default:
      return state;
  }
}
