import { combineReducers } from "redux";
import devices from "./devices";
import installer from "./installer";

export default combineReducers({
  [devices.constants.NAME]: devices.reducer,
  [installer.constants.NAME]: installer.reducer
});
