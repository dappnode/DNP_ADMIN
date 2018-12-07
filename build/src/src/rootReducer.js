import { combineReducers } from "redux";
import merge from "deepmerge";
import navbar from "./navbar";
import devices from "./devices";
import installer from "./installer";
import dashboard from "./dashboard";
import packages from "./packages";
import system from "./system";
import status from "./status";
import activity from "./activity";

const modules = [
  navbar, 
  devices, 
  installer, 
  dashboard, 
  packages, 
  system, 
  status, 
  activity
]

// Prevent manifest arrays to keep populating
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

// Define global reducers. This live outside from the module construction
const globalReducers = {
  directory: (state = {}, action) => {
    switch (action.type) {
      case "UPDATE_DIRECTORY":
        return merge(state, action.pkgs || {}, { arrayMerge: overwriteMerge });
      default:
        return state;
    }
  },
  installedPackages: (state = [], action) => {
    switch (action.type) {
      case "UPDATE_INSTALLED_PACKAGES":
        return action.packages;
      default:
        return state;
    }
  },
  session: (state = null, action) => {
    switch (action.type) {
      case "CONNECTION_OPEN":
        return action.session;
      default:
        return state;
    }
  },
  isSyncing: (state = null, action) => {
    switch (action.type) {
      case "UPDATE_IS_SYNCING":
        return action.isSyncing;
      default:
        return state;
    }
  },
  chainData: (state = [], action) => {
    switch (action.type) {
      case "UPDATE_CHAIN_DATA":
        return action.chainData;
      default:
        return state;
    }
  },
  packageStatus: (state = {}, action) => {
    switch (action.type) {
      case "UPDATE_PACKAGE_STATUS":
        return {
          ...state,
          [action.packageName]: action.connected
        }
      default:
        return state;
    }
  }
}

// Map modules to reducers: 
const moduleReducers = {}
for (const _module of modules) {
  moduleReducers[_module.constants.NAME] = _module.reducer
}

export default combineReducers({
  ...globalReducers,
  ...moduleReducers
});
