import { combineReducers } from "redux";
import devices from "./devices";

export default combineReducers({
  [devices.constants.NAME]: devices.reducer
});
