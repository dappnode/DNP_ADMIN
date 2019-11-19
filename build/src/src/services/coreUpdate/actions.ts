import { CoreUpdateData } from "types";
import {
  UPDATE_CORE,
  UPDATE_CORE_UPDATE_DATA,
  UPDATE_UPDATING_CORE,
  UpdateCoreUpdateData,
  UpdateUpdatingCore,
  UpdateCore
} from "./types";

// Service > coreUpdate

export const updateCoreUpdateData = (
  coreUpdateData: CoreUpdateData
): UpdateCoreUpdateData => ({
  type: UPDATE_CORE_UPDATE_DATA,
  coreUpdateData
});

export const updateUpdatingCore = (
  updatingCore: boolean
): UpdateUpdatingCore => ({
  type: UPDATE_UPDATING_CORE,
  updatingCore
});

export const updateCore = (): UpdateCore => ({
  type: UPDATE_CORE
});
