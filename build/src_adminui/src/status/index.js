// WATCHERS
import * as actions from "./actions";
import * as constants from "./constants";
import * as selectors from "./selectors";
import reducer from "./reducer";
import saga from "./sagas";

import DependenciesAlert from "./components/DependenciesAlert";

export default {
  component: null,
  components: {
    DependenciesAlert
  },
  actions,
  constants,
  reducer,
  selectors,
  saga
};
