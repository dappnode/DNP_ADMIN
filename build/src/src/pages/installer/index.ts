import InstallerRoot from "./components/InstallerRoot";
import ProgressLogsView from "./components/InstallCardComponents/ProgressLogsView";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

const components = {
  InstallerRoot,
  ProgressLogsView
};

export default {
  mountPoint,
  rootPath,
  RootComponent: InstallerRoot,
  components
};
