import SdkHome from "./components/SdkHome";
import * as data from "./data";

export const rootPath = data.rootPath;
export const mountPoint = data.mountPoint;

export default {
  mountPoint,
  rootPath,
  RootComponent: SdkHome,
  component: SdkHome
};
