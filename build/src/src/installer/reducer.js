//  INSTALLER
import * as t from "./actionTypes";

const initialState = {
  fetching: false,
  directory: [],
  packages: {},
  selectedPackageId: "",
  selectedVersion: "",
  selectedTypes: [],
  input: "",
  isInstalling: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.ISINSTALLING:
      return {
        ...state,
        isInstalling: {
          ...state.isInstalling,
          [action.id]: action.payload
        }
      };
    case t.UPDATE_FETCHING:
      return {
        ...state,
        fetching: action.fetching
      };
    case t.UPDATE_DIRECTORY:
      return {
        ...state,
        directory: action.directory
      };
    case t.UPDATE_PACKAGE:
      return {
        ...state,
        packages: {
          ...state.packages,
          [action.id]: Object.assign(
            state.packages[action.id] || {},
            action.data
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
    default:
      return state;
  }
}
