import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import PackagesRoot from "./components/PackagesRoot";
import PackageInterface from "./components/PackageInterface";
import PackageList from "./components/PackageList";
import saga from "./sagas";

const components = {
  PackagesRoot,
  PackageList,
  PackageInterface
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
