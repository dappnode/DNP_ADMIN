import * as actions from "./actions";
import * as selectors from "./selectors";
import { PackagesRoot } from "./components/PackagesRoot";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

export default {
  mountPoint,
  rootPath,
  RootComponent: PackagesRoot,
  actions,
  selectors
};
