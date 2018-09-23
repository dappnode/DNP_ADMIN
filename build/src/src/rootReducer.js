import { combineReducers } from "redux";
import merge from "deepmerge";
import navbar from "./navbar";
import devices from "./devices";
import installer from "./installer";
import dashboard from "./dashboard";
import packages from "./packages";
import system from "./system";
import status from "./status";
import chains from "./chains";
import activity from "./activity";

// Prevent manifest arrays to keep populating
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

const directoryReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_DIRECTORY":
      return merge(state, action.pkgs || {}, { arrayMerge: overwriteMerge });
    default:
      return state;
  }
};

const installedPackagesReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE_INSTALLED_PACKAGES":
      return action.packages;
    default:
      return state;
  }
};

const sessionReducer = (state = null, action) => {
  switch (action.type) {
    case "CONNECTION_OPEN":
      return action.session;
    default:
      return state;
  }
};

export default combineReducers({
  [devices.constants.NAME]: devices.reducer,
  [installer.constants.NAME]: installer.reducer,
  [dashboard.constants.NAME]: dashboard.reducer,
  [packages.constants.NAME]: packages.reducer,
  [system.constants.NAME]: system.reducer,
  [status.constants.NAME]: status.reducer,
  [chains.constants.NAME]: chains.reducer,
  [navbar.constants.NAME]: navbar.reducer,
  [activity.constants.NAME]: activity.reducer,
  session: sessionReducer,
  directory: directoryReducer,
  installedPackages: installedPackagesReducer
});
