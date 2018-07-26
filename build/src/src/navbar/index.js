// NAVBAR
import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";

import Navbar from "./components/Navbar";

const components = {
  Navbar
};

const component = Navbar;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors
};
