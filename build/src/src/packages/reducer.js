//  PACKAGES
import * as t from "./actionTypes";

const initialState = {
  fetching: false,
  hasFetched: false,
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
    case t.UPDATE_FETCHING:
      return {
        ...state,
        fetching: action.fetching
      };
    case t.HAS_FETCHED_PACKAGES:
      return {
        ...state,
        hasFetched: true
      };
    default:
      return state;
  }
}
