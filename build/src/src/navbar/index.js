// NAVBAR
import * as actions from "./actions";
import * as actionTypes from "./actionTypes";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import saga from "./sagas";

import Navbar from "./components/Navbar";

const components = {
  Navbar
};

const component = Navbar;

export default {
  actions,
  actionTypes,
  component,
  components,
  constants,
  reducer,
  selectors,
  saga
};
