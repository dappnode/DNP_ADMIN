import { wrapRoute } from "./wrapRoute";
import * as routes from "../route-types";

export const autoUpdateDataGet = wrapRoute(routes.autoUpdateDataGet);
export const diagnose = wrapRoute(routes.diagnose);
export const fetchCoreUpdateData = wrapRoute(routes.fetchCoreUpdateData);
export const fetchDirectory = wrapRoute(routes.fetchDirectory);
export const fetchDnpRequest = wrapRoute(routes.fetchDnpRequest);
export const getStats = wrapRoute(routes.getStats);
export const installPackage = wrapRoute(routes.installPackage);
export const mountpointsGet = wrapRoute(routes.mountpointsGet);
export const packageDetailDataGet = wrapRoute(routes.packageDetailDataGet);
export const listPackages = wrapRoute(routes.listPackages);
export const packageGettingStartedToggle = wrapRoute(
  routes.packageGettingStartedToggle
);
export const passwordChange = wrapRoute(routes.passwordChange);
export const passwordIsSecure = wrapRoute(routes.passwordIsSecure);
export const restartPackageVolumes = wrapRoute(routes.restartPackageVolumes);
export const systemInfoGet = wrapRoute(routes.systemInfoGet);
export const volumeRemove = wrapRoute(routes.volumeRemove);
export const volumesGet = wrapRoute(routes.volumesGet);
