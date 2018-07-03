import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";

import DevicesRoot from "./components/DevicesRoot";
import Devices from "./containers/Devices";

export default {
  actions,
  component: DevicesRoot,
  components: {
    DevicesRoot
  },
  constants,
  reducer,
  selectors
};
