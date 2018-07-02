import { combineReducers } from "redux";
import devices from "./devices";
import installer from "./installer";
import dashboard from "./dashboard";
import packages from "./packages";
import status from "./status";
import chains from "./chains";

export default combineReducers({
  [devices.constants.NAME]: devices.reducer,
  [installer.constants.NAME]: installer.reducer,
  [dashboard.constants.NAME]: dashboard.reducer,
  [packages.constants.NAME]: packages.reducer,
  [status.constants.NAME]: status.reducer,
  [chains.constants.NAME]: chains.reducer
});
