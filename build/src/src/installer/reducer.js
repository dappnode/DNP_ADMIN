//  INSTALLER
import t from "./actionTypes";
import merge from "deepmerge";

const initialState = {
  queryId: null,
  fetching: false,
  directory: [],
  selectedTypes: {},
  searchInput: "",
  isInstalling: {},
  progressLogs: {},
  shouldOpenPorts: false,
  showAdvancedSettings: false,
  userSetEnvs: {},
  userSetPorts: {},
  userSetVols: {}
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
        searchInput: action.payload
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
    case t.UPDATE_QUERY_ID:
      return merge(state, {
        queryId: action.id
      });
    // User set
    case t.UPDATE_USERSET_ENVS:
      return merge(state, {
        userSetEnvs: {
          [action.dnpName]: {
            [action.key]: action.value
          }
        }
      });
    case t.UPDATE_USERSET_PORTS:
      return merge(state, {
        userSetPorts: {
          [action.dnpName]: {
            [action.id]: action.values
          }
        }
      });
    case t.UPDATE_USERSET_VOLS:
      return merge(state, {
        userSetVols: {
          [action.dnpName]: {
            [action.id]: action.values
          }
        }
      });
    case t.SET_SHOW_ADVANCED_SETTINGS:
      return merge(state, {
        showAdvancedSettings: action.value
      });
    case t.CLEAR_USERSET:
      return {
        ...state,
        userSetEnvs: {},
        userSetPorts: {},
        userSetVols: {},
        showAdvancedSettings: false
      };
    // #### Default case
    default:
      return state;
  }
}
