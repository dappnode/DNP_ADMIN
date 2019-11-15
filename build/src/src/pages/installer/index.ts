import InstallerRoot from "./components/InstallerRoot";
import ProgressLogs from "./components/InstallCardComponents/ProgressLogs";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

const components = {
  InstallerRoot,
  ProgressLogs
};

export default {
  mountPoint,
  rootPath,
  RootComponent: InstallerRoot,
  components
};
