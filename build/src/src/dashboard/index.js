// WATCHERS
import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import "./modules";

import Dashboard from "./containers/Dashboard";

export default {
  component: Dashboard,
  actions,
  constants,
  reducer
};
