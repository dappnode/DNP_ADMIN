import * as selectors from "./selectors";
import TroubleshootRoot from "./components/TroubleshootRoot";
import * as data from "./data";

export const rootPath = data.rootPath;

export default {
  rootPath,
  RootComponent: TroubleshootRoot,
  selectors
};
