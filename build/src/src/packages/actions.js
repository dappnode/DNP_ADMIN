// INSTALLER
import * as t from "./actionTypes";
import { shortName } from "utils/format";
import installer from "installer"

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

export const logPackage = kwargs => ({
  type: t.LOG_PACKAGE,
  kwargs
});

// Used in package interface / envs

export const updatePackageEnv = kwargs => ({
  type: t.CALL,
  method: "updatePackageEnv",
  message:
    "Updating " + kwargs.id + " envs: " + JSON.stringify(kwargs.envs) + "...",
  kwargs
});

// Used in package interface / controls

export const togglePackage = kwargs => ({
  type: t.CALL,
  method: "togglePackage",
  message: "Toggling " + shortName(kwargs.id) + "...",
  kwargs
});

export const restartPackage = kwargs => ({
  type: t.CALL,
  method: "restartPackage",
  message: "Restarting " + shortName(kwargs.id) + "...",
  kwargs
});

export const restartPackageVolumes = kwargs => ({
  type: t.CALL,
  method: "restartPackageVolumes",
  message: "Restarting " + shortName(kwargs.id) + " volumes...",
  kwargs
});

export const removePackage = kwargs => ({
  type: t.CALL,
  method: "removePackage",
  message:
    "Removing package " +
    shortName(kwargs.id) +
    (kwargs.deleteVolumes ? " and volumes" : "") +
    "...",
  kwargs
});

export const closePorts = ports => ({
  type: installer.actionTypes.MANAGE_PORTS,
  action: 'close',
  ports
});

// #### After removing a package, uninstallChain
