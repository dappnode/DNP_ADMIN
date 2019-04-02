import * as t from "./actionTypes";

// pages > system

export const updateCore = () => ({
  type: t.UPDATE_CORE
});

export const updateCoreManifest = coreManifest => ({
  type: t.UPDATE_CORE_MANIFEST,
  coreManifest
});

export const updateCoreDeps = coreDeps => ({
  type: t.UPDATE_CORE_DEPS,
  coreDeps
});

export const setStaticIp = staticIp => ({
  type: t.SET_STATIC_IP,
  staticIp
});
