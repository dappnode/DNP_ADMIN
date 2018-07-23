// INSTALLER
import * as t from "./actionTypes";
import * as APIcalls from "API/crossbarCalls";

// #### TODO: Clean unused actions

export const setId = id => ({
  type: t.SET_ID,
  payload: id
});

export const selectPackage = id => ({
  type: t.UPDATE_SELECTED_PACKAGE,
  payload: id
});

export const initialized = () => ({
  type: t.INITIALIZED
});

export const updateInput = id => ({
  type: t.UPDATE_INPUT,
  payload: id
});

export const updateSelectedVersion = index => ({
  type: t.UPDATE_SELECTED_VERSION,
  payload: index
});

export const updateSelectedTypes = types => ({
  type: t.UPDATE_SELECTED_TYPES,
  payload: types
});

export const updatePackages = packages => ({
  type: t.UPDATE_PACKAGES,
  payload: packages
});

export const listPackages = () => ({
  type: t.LIST_PACKAGES
});

// #### TODO: refactor to sagas

const updateLog = (data, id) => ({
  type: t.UPDATE_LOG,
  payload: data === "" ? "Received empty logs" : data,
  id: id
});

export const logPackage = kwargs => dispatch => {
  APIcalls.logPackage(kwargs).then(res => {
    if (res) dispatch(updateLog(res.logs, res.id));
  });
};

export const updatePackageEnv = kwargs => ({
  type: t.CALL,
  call: "updatePackageEnv",
  kwargs
});

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
