import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import saga from "./sagas";
import SdkRoot from "./components/SdkRoot";

export default {
  actions,
  selectors,
  saga,
  reducer,
  constants,
  component: SdkRoot
};
