import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import Installer from "./containers/Installer";

const components = {
  Installer
};

const component = Installer;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors
};
