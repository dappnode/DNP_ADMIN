import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import Packages from "./components/PackagesRoot";
import saga from "./sagas";

const components = {
  Packages
};

const component = Packages;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors,
  saga
};
