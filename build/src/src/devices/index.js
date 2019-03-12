import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import saga from "./sagas";

import DevicesRoot from "./components/DevicesRoot";

export default {
  actions,
  component: DevicesRoot,
  components: {
    DevicesRoot
  },
  constants,
  reducer,
  selectors,
  saga
};
