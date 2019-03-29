//  PACKAGES
import * as t from "./actionTypes";

const initialState = {
  logs: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_LOG:
      // Destructive operation, don't merge
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.id]: action.logs
        }
      };

    default:
      return state;
  }
}
