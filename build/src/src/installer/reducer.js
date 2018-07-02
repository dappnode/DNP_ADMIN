//  INSTALLER
import * as t from "./actionTypes";

const initialState = {
  initializing: true,
  fetching: false,
  directory: [],
  packages: {},
  selectedPackageId: "",
  selectedVersion: "",
  selectedTypes: [],
  input: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_FETCHING:
      return {
        ...state,
        fetching: action.payload
      };
    case t.UPDATE_DIRECTORY:
      return {
        ...state,
        directory: action.payload
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
    case t.UPDATE_SELECTED_PACKAGE:
      return {
        ...state,
        selectedPackageId: action.payload
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
