// INSTALLER
import * as t from "./actionTypes";
import * as APIcalls from "API/crossbarCalls";

// Used in package interface

export const setId = id => ({
  type: t.SET_ID,
  payload: id
});

// Used in package root

export const updatePackages = packages => ({
  type: t.UPDATE_PACKAGES,
  packages
});

export const listPackages = () => ({
  type: t.LIST_PACKAGES
});

// Used in package interface / logs
// #### TODO: refactor to sagas

const updateLog = (logs, id) => ({
  type: t.UPDATE_LOG,
  payload: logs === "" ? "Received empty logs" : logs,
  id: id
});

export const logPackage = kwargs => dispatch => {
  APIcalls.logPackage(kwargs).then(res => {
    if (res) dispatch(updateLog(res.logs, res.id));
  });
};

// Used in package interface / envs

export const updatePackageEnv = kwargs => ({
  type: t.CALL,
  call: "updatePackageEnv",
  kwargs
});

// Used in package interface / controls

export const togglePackage = kwargs => ({
  type: t.CALL,
  call: "togglePackage",
  kwargs
});

export const restartPackage = kwargs => ({
  type: t.CALL,
  call: "restartPackage",
  kwargs
});

export const restartVolumes = kwargs => ({
  type: t.CALL,
  call: "restartVolumes",
  kwargs
});

export const removePackage = kwargs => ({
  type: t.CALL,
  call: "removePackage",
  kwargs
});

// #### After removing a package, uninstallChain
