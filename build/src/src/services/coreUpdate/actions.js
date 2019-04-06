import * as t from "./actionTypes";

// Service > coreUpdate

// Update

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

export const updateUpdatingCore = updatingCore => ({
  type: t.UPDATE_UPDATING_CORE,
  updatingCore
});
