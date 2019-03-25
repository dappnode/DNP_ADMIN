import * as actions from "./actions";
import reducer from "./reducer";
import * as selectors from "./selectors";
import TroubleshootRoot from "./components/TroubleshootRoot";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

export default {
  mountPoint,
  rootPath,
  RootComponent: TroubleshootRoot,
  actions,
  reducer,
  selectors
};
