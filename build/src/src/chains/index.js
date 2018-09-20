// WATCHERS
import * as actions from "./actions";
import * as actionTypes from "./actionTypes";
import * as constants from "./constants";
import reducer from "./reducer";
import "./modules";
import * as selectors from "./selectors";
import saga from "./sagas";

import ChainStatusLog from "./components/ChainStatusLog";

export default {
  component: null,
  components: {
    ChainStatusLog
  },
  actions,
  actionTypes,
  constants,
  reducer,
  selectors,
  saga
};
