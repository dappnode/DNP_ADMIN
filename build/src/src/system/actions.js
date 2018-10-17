// INSTALLER
import * as t from "./actionTypes";
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

export const restartPackage = kwargs => ({
  type: t.CALL,
  method: "restartPackage",
  message: "Restarting " + shortName(kwargs.id) + "...",
  kwargs
});

export const restartVolumes = kwargs => ({
  type: t.CALL,
  method: "restartVolumes",
  message: "Restarting " + shortName(kwargs.id) + " volumes...",
  kwargs
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
