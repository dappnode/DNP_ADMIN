import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";

import DevicesInterface from "./containers/Devices";

const components = {
  DevicesInterface
};

export default { actions, components, constants, reducer, selectors };
