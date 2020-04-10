import * as selectors from "./selectors";
import SupportRoot from "./components/SupportRoot";
import * as data from "./data";

export const rootPath = data.rootPath;

export default {
  rootPath,
  RootComponent: SupportRoot,
  selectors
};
