// WATCHERS
import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";

import Status from "./components/Status";
import DependenciesAlert from "./components/DependenciesAlert";

export default {
  component: Status,
  components: {
    DependenciesAlert
  },
  actions,
  constants,
  reducer
};
