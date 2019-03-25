import reducer from "./reducer";
import * as selectors from "./selectors";
import saga from "./sagas";
import InstallerRoot from "./components/InstallerRoot";
import ProgressLog from "./components/InstallCardComponents/ProgressLog";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

const components = {
  InstallerRoot,
  ProgressLog
};

export default {
  mountPoint,
  rootPath,
  RootComponent: InstallerRoot,
  components,
  reducer,
  selectors,
  saga
};
