//  PACKAGES
import * as t from "./actionTypes";

const initialState = {
  packages: [],
  logs: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_PACKAGES:
      return {
        ...state,
        packages: action.packages
      };
    case t.UPDATE_LOG:
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
