// INSTALLER
import * as t from "./actionTypes";

// Used in package interface

export const updateCore = () => ({
  type: t.UPDATE_CORE
});

// Used in package root

export const updateCoreManifest = coreManifest => ({
  type: t.UPDATE_CORE_MANIFEST,
  coreManifest
});

export const updateCoreDeps = coreDeps => ({
  type: t.UPDATE_CORE_DEPS,
  coreDeps
});

// Used in package interface / logs
// #### TODO: refactor to sagas

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
