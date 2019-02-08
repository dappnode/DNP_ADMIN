// INSTALLER
import t from "./actionTypes";
import { shortName } from "utils/format";

// Used in package interface

export const updateCore = () => ({
  type: t.UPDATE_CORE
});

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
  kwargs: { id, options }
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

export const restartPackage = id => ({
  type: t.CALL,
  method: "restartPackage",
  message: "Restarting " + shortName(id) + "...",
  kwargs: { id }
});

export const restartPackageVolumes = id => ({
  type: t.CALL,
  method: "restartPackageVolumes",
  message: "Restarting " + shortName(id) + " volumes...",
  kwargs: { id }
});

export const setStaticIp = staticIp => ({
  type: t.SET_STATIC_IP,
  staticIp
});

export const updateStaticIp = staticIp => ({
  type: t.UPDATE_STATIC_IP,
  staticIp
});

export const updateStaticIpInput = staticIpInput => ({
  type: t.UPDATE_STATIC_IP_INPUT,
  staticIpInput
});

// #### After removing a package, uninstallChain
