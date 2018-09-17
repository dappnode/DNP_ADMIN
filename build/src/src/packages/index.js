import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import PackagesRoot from "./components/PackagesRoot";
import PackageRow from "./components/PackageRow";
import Details from "./components/PackageViews/Details";
import Logs from "./components/PackageViews/Logs";
import Envs from "./components/PackageViews/Envs";
import saga from "./sagas";

const components = {
  PackagesRoot,
  PackageRow,
  Details,
  Logs,
  Envs
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
