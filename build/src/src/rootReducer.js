import { combineReducers } from "redux";
import navbar from "./navbar";
import devices from "./devices";
import installer from "./installer";
import dashboard from "./dashboard";
import packages from "./packages";
import system from "./system";
import status from "./status";
import chains from "./chains";
import activity from "./activity";

export default combineReducers({
  [devices.constants.NAME]: devices.reducer,
  [installer.constants.NAME]: installer.reducer,
  [dashboard.constants.NAME]: dashboard.reducer,
  [packages.constants.NAME]: packages.reducer,
  [system.constants.NAME]: system.reducer,
  [status.constants.NAME]: status.reducer,
  [chains.constants.NAME]: chains.reducer,
  [navbar.constants.NAME]: navbar.reducer,
  [activity.constants.NAME]: activity.reducer
});
