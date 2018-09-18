import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import System from "./components/SystemRoot";
import saga from "./sagas";

const components = {
  System
};

const component = System;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors,
  saga
};
