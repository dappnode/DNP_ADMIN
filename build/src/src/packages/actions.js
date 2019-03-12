// INSTALLER
import t from "./actionTypes";
import { shortName } from "utils/format";
import installer from "installer";

// Used in package root

export const updatePackages = packages => ({
  type: "UPDATE_INSTALLED_PACKAGES",
  packages
});

export const listPackages = () => ({
  type: t.LIST_PACKAGES
});

// Used in package interface / logs
// #### TODO: refactor to sagas

export const updateLog = (logs, id) => ({
  type: t.UPDATE_LOG,
  logs,
  id
});

export const logPackage = (id, options) => ({
  type: t.LOG_PACKAGE,
  id,
  options
});

// Used in package interface / envs

export const updatePackageEnv = (id, envs) => ({
  type: t.CALL,
  method: "updatePackageEnv",
  message: `Updating ${id} envs: ${JSON.stringify(envs)}...`,
  kwargs: { id, envs, restart: true }
});

// Used in package interface / controls

export const togglePackage = id => ({
  type: t.CALL,
  method: "togglePackage",
  message: `Toggling ${shortName(id)}...`,
  kwargs: { id }
});

export const restartPackage = id => ({
  type: t.CALL,
  method: "restartPackage",
  message: `Restarting ${shortName(id)}...`,
  kwargs: { id }
});

export const restartPackageVolumes = id => ({
  type: t.CALL,
  method: "restartPackageVolumes",
  message: `Restarting ${shortName(id)} volumes...`,
  kwargs: { id }
});

export const removePackage = (id, deleteVolumes) => ({
  type: t.CALL,
  method: "removePackage",
  message: `Removing ${shortName(id)} ${
    deleteVolumes ? " and volumes" : ""
  }...`,
  kwargs: { id, deleteVolumes }
});

export const closePorts = ports => ({
  type: installer.actionTypes.MANAGE_PORTS,
  action: "close",
  ports
});

// File manager

export const copyFileTo = ({ id, dataUri, toPath }) => ({
  type: t.CALL,
  method: "copyFileTo",
  message: `Copying file to ${shortName(id)} ${toPath}...`,
  kwargs: { id, dataUri, toPath }
});

export const copyFileFrom = ({ id, fromPath }) => ({
  type: t.COPY_FILE_FROM,
  id,
  fromPath
});
