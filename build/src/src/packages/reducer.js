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
        packages: action.payload
      };
    case t.UPDATE_PACKAGE:
      return {
        ...state,
        packages: {
          ...state.packages,
          [action.id]: Object.assign(
            state.packages[action.id] || {},
            action.payload
          )
        }
      };
    case t.UPDATE_LOG:
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.id]: action.payload
        }
      };
    case t.UPDATE_SELECTED_VERSION:
      return {
        ...state,
        selectedVersion: action.payload
      };
    case t.UPDATE_SELECTED_TYPES:
      return {
        ...state,
        selectedTypes: action.payload
      };
    case t.UPDATE_INPUT:
      return {
        ...state,
        input: action.payload
      };
    case t.INITIALIZED:
      return {
        ...state,
        initializing: false
      };
    default:
      return state;
  }
}
