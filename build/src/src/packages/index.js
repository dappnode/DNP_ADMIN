import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import PackagesRoot from "./components/PackagesRoot";
import saga from "./sagas";

const components = {
  PackagesRoot
};

const component = PackagesRoot;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors,
  saga
};
