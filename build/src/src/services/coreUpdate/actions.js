import * as t from "./actionTypes";

// Service > coreUpdate

// Update

export const updateCore = () => ({
  type: t.UPDATE_CORE
});

export const updateCoreUpdateData = coreUpdateData => ({
  type: t.UPDATE_CORE_UPDATE_DATA,
  coreUpdateData
});

export const updateUpdatingCore = updatingCore => ({
  type: t.UPDATE_UPDATING_CORE,
  updatingCore
});
