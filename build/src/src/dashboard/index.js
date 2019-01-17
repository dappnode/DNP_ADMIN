// WATCHERS
import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import saga from "./sagas";

import Dashboard from "./components/Dashboard";

export default {
  component: Dashboard,
  actions,
  constants,
  reducer,
  saga
};
