import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";

import DevicesInterface from "./containers/Devices";

const components = {
  DevicesInterface
};

const component = DevicesInterface;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors
};
