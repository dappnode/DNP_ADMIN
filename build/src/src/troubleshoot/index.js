import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import TroubleshootRoot from "./components/TroubleshootRoot";
import saga from "./sagas";

const components = {
  TroubleshootRoot
};

const component = TroubleshootRoot;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors,
  saga
};
