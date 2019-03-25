import * as actions from "./actions";
import reducer from "./reducer";
import * as selectors from "./selectors";
import System from "./components/SystemRoot";
import saga from "./sagas";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

export default {
  mountPoint,
  rootPath,
  RootComponent: System,
  actions,
  reducer,
  selectors,
  saga
};
