// WATCHERS
import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import saga from "./sagas";

import Activity from "./components/Activity";

export default {
  component: Activity,
  actions,
  constants,
  reducer,
  saga
};
