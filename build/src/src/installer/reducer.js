//  INSTALLER
import * as t from "./actionTypes";
import merge from "deepmerge";

const initialState = {
  fetching: false,
  directory: [],
  selectedTypes: {},
  input: "",
  isInstalling: {},
  progressLogs: {},
  shouldOpenPorts: false,
  diskSpaceAvailable: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_FETCHING:
      return {
        ...state,
        fetching: action.fetching
      };
    case t.UPDATE_SELECTED_TYPES:
      return merge(state, {
        selectedTypes: action.payload
      });
    case t.UPDATE_INPUT:
      return merge(state, {
        input: action.payload
      });
    case t.SHOULD_OPEN_PORTS:
      return merge(state, {
        shouldOpenPorts: action.shouldOpenPorts
      });
    case t.PROGRESS_LOG:
      return merge(state, {
        progressLogs: {
          [action.logId]: {
            [action.pkgName]: action.msg
          }
        }
      });
    case t.CLEAR_PROGRESS_LOG:
      // When an installation has finished, clear all pkg's progressLogs
      // that belonged to that installation, refered by the logId
      const progressLogs = Object.assign({}, state.progressLogs);
      delete progressLogs[action.logId];
      // Destructive action, cannot use merge
      return {
        ...state,
        progressLogs
      };
    case t.UPDATE_DISK_SPACE_AVAILABLE:
      return merge(state, {
        diskSpaceAvailable: {
          [action.path]: action.status
        }
      });
    default:
      return state;
  }
}
