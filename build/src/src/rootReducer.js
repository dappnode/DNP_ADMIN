import { combineReducers } from "redux";
import devices from "./devices";
import installer from "./installer";
import dashboard from "./dashboard";

export default combineReducers({
  [devices.constants.NAME]: devices.reducer,
  [installer.constants.NAME]: installer.reducer,
  [dashboard.constants.NAME]: dashboard.reducer
});
